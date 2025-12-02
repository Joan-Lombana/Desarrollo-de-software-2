import { Component } from '@angular/core';
import { LeafletMapService } from '../../services/leaflet-map';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-herramientasmapa',
  imports: [FormsModule, CommonModule],
  templateUrl: './herramientasmapa.html',
  styleUrl: './herramientasmapa.scss',
})
export class Herramientasmapa {

  showSaveModal = false;
  nombreRuta = "";
  modoDibujo = false; // ← nuevo estado


  constructor(
  private mapService: LeafletMapService,
  private http: HttpClient
    
  ) {}

  onToolClick(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;

  // Reset animación para permitir múltiples clics
  el.classList.remove("clicked");
  void el.offsetWidth; // reinicia animación
  el.classList.add("clicked");
}


  openSaveModal() {
  if (!this.routeReady()) return;  // ← evita abrir el modal
  this.showSaveModal = true;
  }


  closeSaveModal() {
    this.showSaveModal = false;
  }

  // Retroceder último punto
  undoPoint() {
    this.mapService.undoLastPoint();
  }


   // Activar modo de selección de puntos
  toggleDrawing() {
    if (this.modoDibujo) {
      this.mapService.disablePointSelection();
    } else {
      this.mapService.enablePointSelection();
    }
    this.modoDibujo = !this.modoDibujo; // alterna estado
  }


  // Crear ruta con OSRM
  makeRoute() {
    this.mapService.disablePointSelection();
    this.mapService.createRoute();
  }

  routeReady() {
    return this.mapService.isRouteCreated();
  }

  // Exportar GeoJSON
  saveRoute() {
    const geometry = this.mapService.getRouteGeoJSON();
    if (!geometry) {
      alert("No hay ruta para guardar");
      return;
    }

    const body = {
      nombre_ruta: this.nombreRuta,
      perfil_id: "18851282-1a08-42b7-9384-243cc2ead349",
      shape: geometry
    };

    this.http.post("http://localhost:3000/apilucio/rutas", body)
      .subscribe(resp => {
        console.log("Ruta guardada", resp);
        this.closeSaveModal();
      });
  }
}
