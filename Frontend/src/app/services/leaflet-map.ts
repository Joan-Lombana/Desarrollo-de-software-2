import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {
  private map: L.Map | null = null;

  // --- variables internas para dibujar ---
  private drawing = false;
  private drawnPoints: L.LatLng[] = [];
  private drawnLayer: L.Polyline | null = null;

  // --------------------------------------------------
  // 1. Inicializar mapa
  // --------------------------------------------------
  initMap(
    containerId: string,
    center: L.LatLngExpression = [3.42158, -76.5205],
    zoom: number = 13
  ): void {
    if (this.map) return;

    this.map = L.map(containerId).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  // --------------------------------------------------
  // 2. Agregar capas GeoJSON (para rutas guardadas)
  // --------------------------------------------------
  addGeoJsonLayer(geojson: any, options?: L.GeoJSONOptions): void {
    if (!this.map) return;

    const layer = L.geoJSON(geojson, {
      style: {
        color: '#ff6600',
        weight: 4,
      },
      ...options,
    });

    layer.addTo(this.map);
    this.map.fitBounds(layer.getBounds());
  }

  // --------------------------------------------------
  // 3. Activar dibujo de ruta
  // --------------------------------------------------
  enableDrawing(): void {
  if (!this.map) return;

  this.drawing = true;
  this.drawnPoints = [];

  // 🔹 Desactivar arrastre del mapa mientras se dibuja
  this.map.dragging.disable();

  // Escuchar clics en el mapa
  this.map.on('click', this.onMapClick);
}

  // Desactivar modo dibujo
  disableDrawing(): void {
    if (!this.map) return;

    this.drawing = false;
    this.map.off('click', this.onMapClick);
  }

  // Evento al hacer clic en el mapa
  private onMapClick = (e: L.LeafletMouseEvent): void => {
    if (!this.drawing) return;

    // Agregar punto
    this.drawnPoints.push(e.latlng);

    // Eliminar línea anterior
    if (this.drawnLayer) {
      this.map?.removeLayer(this.drawnLayer);
    }

    // Dibujar línea nueva
    this.drawnLayer = L.polyline(this.drawnPoints, {
      color: '#ff6600',
      weight: 4,
    }).addTo(this.map!);
  };

  // --------------------------------------------------
  // 4. Obtener ruta dibujada (puntos)
  // --------------------------------------------------
  getDrawnRoute(): L.LatLng[] {
    return this.drawnPoints;
  }

  // --------------------------------------------------
  // 5. Obtener ruta en formato GeoJSON
  // --------------------------------------------------
  getDrawnRouteGeoJSON(): any {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: this.drawnPoints.map((p) => [p.lng, p.lat]),
      },
      properties: {},
    };
  }

  // --------------------------------------------------
  // 6. Limpiar mapa
  // --------------------------------------------------
  clearMap(): void {
    if (!this.map) return;
    this.map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      this.map?.removeLayer(layer);
    });
  }

  getMap(): L.Map | null {
    return this.map;
  }
}
