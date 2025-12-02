import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {

  private map: L.Map | null = null;
  private routeCreated = false;

  private waypoints: L.LatLng[] = [];
  private routingControl: any;

  private pointLayers: L.Layer[] = [];  // puntos temporales (fase dibujo)

  initMap(containerId: string) {
    if (this.map) return;

    this.map = L.map(containerId).setView([3.8801, -77.0312], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.getContainer().style.cursor = 'grab';
  }

  isRouteCreated(): boolean {
  return this.routeCreated;
  }

  // -------------------------------------------------
  // FASE 1 → Selección de puntos (modo dibujo)
  // -------------------------------------------------
  enablePointSelection() {
    if (!this.map) return;

    this.waypoints = [];
    this.clearMarkers();
    this.routeCreated = false;

    // deshabilitar movimiento y activar cursor
    this.map.dragging.disable();
    this.map.getContainer().style.cursor = 'crosshair';

    this.map.on('click', this.selectPoint);

    // Si había ruta antes → eliminarla
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
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

  // -------------------------------------------------
  // Deshacer punto o reset completo si ya hay ruta
  // -------------------------------------------------
  undoLastPoint() {
    if (!this.map) return;

    // Si ya hay ruta creada → RESET TOTAL
    if (this.routeCreated) {
      this.resetAll();
      return;
    }

    // Si no hay ruta creada → eliminar último punto normal
    if (this.pointLayers.length === 0) return;

    const last = this.pointLayers.pop();
    if (last) this.map.removeLayer(last);

    this.waypoints.pop();
  }

  // -------------------------------------------------
  // FASE 2 → Trazar ruta final
  // -------------------------------------------------
  createRoute() {
    if (!this.map || this.waypoints.length < 2) return;

    // eliminar marcadores temporales
    this.clearMarkers();

    // borrar ruta anterior
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    const startIcon = L.icon({
       iconUrl: 'punto.png',
        iconSize: [20, 20],
        iconAnchor: [10, 10], // ← centro exacto
      })

    const endIcon = L.icon({
      iconUrl: 'fin.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const lastIndex = this.waypoints.length - 1;

    this.routingControl = (L as any).Routing.control({
      waypoints: this.waypoints,
      draggableWaypoints: false,
      addWaypoints: false,

      // SOLO mostrar inicio y fin
      createMarker: (i: number, wp: any) => {
        if (i === 0) return L.marker(wp.latLng, { icon: startIcon });
        if (i === lastIndex) return L.marker(wp.latLng, { icon: endIcon });

        return null; // NO mostrar marcadores intermedios
      },

      router: (L as any).Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
    }).addTo(this.map);

    this.routeCreated = true;
  }

  // -------------------------------------------------
  // Eliminar marcadores temporales
  // -------------------------------------------------
  private clearMarkers() {
    if (!this.map) return;

    this.pointLayers.forEach(marker => this.map!.removeLayer(marker));
    this.pointLayers = [];
  }

  // -------------------------------------------------
  // Reset general (incluye ruta)
  // -------------------------------------------------
  private resetAll() {
    if (!this.map) return;

    // Quitar ruta
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }

    // Quitar puntos
    this.clearMarkers();

    this.waypoints = [];
    this.routeCreated = false;

    alert("Se ha revertido la ruta generada");
  }

  // -------------------------------------------------
  // Obtener GeoJSON (solo geometry)
  // -------------------------------------------------
  getRouteGeoJSON(): any {
    if (!this.routingControl) return null;

    const route = this.routingControl._routes?.[0];
    if (!route) return null;

    const geojson = route.toGeoJSON();
    return geojson.geometry;
  }

  // -------------------------------------------------
  // Cargar GeoJSON ya guardado
  // -------------------------------------------------
  addGeoJsonLayer(geojson: any) {
    if (!this.map) return;

    L.geoJSON(geojson, {
      style: {
        weight: 4,
        opacity: 0.9
      }
    }).addTo(this.map);
  }
}



