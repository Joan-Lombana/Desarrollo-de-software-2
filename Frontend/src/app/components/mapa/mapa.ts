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
    }, 0);
  }
}

