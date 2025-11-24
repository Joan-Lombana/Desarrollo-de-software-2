import { Component, AfterViewInit } from '@angular/core';
import { LeafletMapService } from '../../services/leaflet-map';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss'],
})
export class MapaComponent implements AfterViewInit {

  constructor(
    private mapService: LeafletMapService,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    // 🔹 Asegurarse de que el mapa se cargue después de renderizar el DOM
    setTimeout(() => {
      this.mapService.initMap('map');

      // 🔹 Llamada HTTP
      this.http.post<any[]>('http://localhost:3000/apilucio/rutas', {
        perfil_id: '18851282-1a08-42b7-9384-243cc2ead349',
      }).subscribe(rutas => {
        rutas.forEach(ruta => {
          if (ruta.shape) {
            this.mapService.addGeoJsonLayer(ruta.shape);
          }
        });
      });
    }, 0);
  }
}