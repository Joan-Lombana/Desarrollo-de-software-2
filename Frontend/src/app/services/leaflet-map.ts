import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class LeafletMapService {
  private map: L.Map | null = null;

  initMap(containerId: string, center: L.LatLngExpression = [3.42158, -76.5205], zoom: number = 13): void {
    if (this.map) return;

    this.map = L.map(containerId).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

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

  clearMap(): void {
    if (!this.map) return;
    this.map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return;
      this.map?.removeLayer(layer);
    });
  }

  getMap(): L.Map | null {
    return this.map;
  }
}