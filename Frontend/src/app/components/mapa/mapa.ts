import { Component, AfterViewInit } from '@angular/core';
import { LeafletMapService } from '../../services/leaflet-map.services';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.scss'],
})
export class MapaComponent implements AfterViewInit {

  private rutasUrl = `${environment.apiUrl}/operativo/rutas`;

  constructor(
    private mapService: LeafletMapService,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.mapService.initMap('map');

      // Cargar rutas desde backend
      this.http.get<any[]>(this.rutasUrl, { params: { perfil_id: '18851282-1a08-42b7-9384-243cc2ead349' } })
  .subscribe(rutas => {
    rutas.forEach(ruta => {
      if (ruta.shape) {
        this.mapService.addGeoJsonLayer(
          typeof ruta.shape === "string" ? JSON.parse(ruta.shape) : ruta.shape
        );
      }
    });
  });
    }, 0);
  }
}

