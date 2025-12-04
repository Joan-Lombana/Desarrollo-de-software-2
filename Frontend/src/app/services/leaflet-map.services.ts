import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {

  private map: L.Map | null = null;
  private routeCreated = false;

  private waypoints: L.LatLng[] = [];
  private pointLayers: L.Layer[] = [];

  private routeLayer: L.GeoJSON | null = null;

  private MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9hbjk5IiwiYSI6ImNtaXBwc2FwcDA4cXYzZ3B2djMzdWsxZDQifQ.jpYs7Myh7Pybt29kWrupog';

  constructor(private http: HttpClient) {}

  /** Inicializa el mapa */
  initMap(containerId: string) {
    if (this.map) return;

    this.map = L.map(containerId).setView([3.8801, -77.0312], 14);

    L.tileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${this.MAPBOX_TOKEN}`,
    { tileSize: 512, zoomOffset: -1, attribution: '© Mapbox © OpenStreetMap' }
    ).addTo(this.map);



    this.map.getContainer().style.cursor = 'grab';
  }

  isRouteCreated() {
    return this.routeCreated;
  }

  /** Activar selección de puntos */
  enablePointSelection() {
    if (!this.map) return;

    this.waypoints = [];
    this.clearMarkers();
    this.routeCreated = false;

    this.map.dragging.disable();
    this.map.getContainer().style.cursor = 'crosshair';

    this.map.on('click', this.selectPoint);

    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
  }

  disablePointSelection() {
    if (!this.map) return;

    this.map.dragging.enable();
    this.map.getContainer().style.cursor = 'grab';
    this.map.off('click', this.selectPoint);
  }

  private selectPoint = (e: L.LeafletMouseEvent) => {
    this.waypoints.push(e.latlng);

    const point = L.circleMarker(e.latlng, {
      radius: 6,
      color: '#3917d3ff',
      fillColor: '#ff6600',
      fillOpacity: 1,
    }).addTo(this.map!);

    this.pointLayers.push(point);
  };

  undoLastPoint() {
    if (!this.map) return;

    if (this.routeCreated) {
      this.resetAll();
      alert('Has revertido la ruta generada');
      return;
    }

    if (this.pointLayers.length === 0) return;

    const last = this.pointLayers.pop();
    if (last) this.map.removeLayer(last);

    this.waypoints.pop();
  }

  /** Crear ruta usando Mapbox Directions API */
  createRoute() {
    if (this.waypoints.length < 2 || !this.map) return;

    const coords = this.waypoints.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&overview=full&access_token=${this.MAPBOX_TOKEN}`;

    this.http.get<any>(url).subscribe(resp => {
      const geometry = resp.routes[0].geometry;

      if (this.routeLayer) this.map!.removeLayer(this.routeLayer);

      this.routeLayer = L.geoJSON(geometry, {
        style: { color: '#007BFF', weight: 4 }
      }).addTo(this.map!);

      this.routeCreated = true;
      this.clearMarkers();
    });
  }

  private clearMarkers() {
    if (!this.map) return;

    this.pointLayers.forEach(layer => this.map!.removeLayer(layer));
    this.pointLayers = [];
  }

  private resetAll() {
    if (!this.map) return;

    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }

    this.clearMarkers();
    this.waypoints = [];
    this.routeCreated = false;

  }

  /** Devuelve GeoJSON listo para guardar */
  getRouteGeoJSON(): { type: "LineString", coordinates: number[][] } | null {
  if (!this.routeLayer) return null;

  const geojson: any = this.routeLayer.toGeoJSON();

  // Caso 1: es un Feature con LineString
  if (geojson.type === "Feature" && geojson.geometry?.type === "LineString") {
    return {
      type: "LineString",
      coordinates: geojson.geometry.coordinates
    };
  }

  // Caso 2: FeatureCollection con un Feature LineString
  if (geojson.type === "FeatureCollection" && geojson.features?.length > 0) {
    const feature = geojson.features[0];
    if (feature.geometry?.type === "LineString") {
      return {
        type: "LineString",
        coordinates: feature.geometry.coordinates
      };
    }
  }

    return null;
  }

  resetMap() {
    this.resetAll();
  }


  /** Cargar ruta guardada */
  addGeoJsonLayer(geojson: any) {
    if (!this.map) return;

    L.geoJSON(geojson, {
      style: { weight: 4, opacity: 0.9, color: '#007BFF' }
    }).addTo(this.map);
  }
}




