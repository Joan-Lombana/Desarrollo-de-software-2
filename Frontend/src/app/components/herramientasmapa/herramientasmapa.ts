import { Component,EventEmitter, Output } from '@angular/core';
import { LeafletMapService } from '../../services/leaflet-map.services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RutasService } from '../../services/rutas.services';




@Component({
  selector: 'app-herramientasmapa',
  imports: [FormsModule, CommonModule],
  templateUrl: './herramientasmapa.html',
  styleUrl: './herramientasmapa.scss',
})
export class Herramientasmapa {
  @Output() cerrarHerramientas = new EventEmitter<void>();
  @Output() rutaGuardada = new EventEmitter<void>();

  showSaveModal = false;
  nombreRuta = "";
  modoDibujo = false; // ← nuevo estado

  constructor(
  private mapService: LeafletMapService,
  private api: RutasService

    
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

  closeSaveModalWithConfirm() {
  let continuar = true;
  if (this.modoDibujo) {
    continuar = confirm(
      '¿Estás seguro de cerrar? Se perderán los puntos no guardados.'
    );

    if (!continuar) return;

    this.mapService.disablePointSelection();
    this.mapService.resetMap();
    this.modoDibujo = false;
    this.nombreRuta = "";
  }
  this.cerrarHerramientas.emit();
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
  const geometry = this.mapService.getRouteGeoJSON(); // ya devuelve { type, coordinates }
  if (!geometry) {
    alert("No hay ruta para guardar");
    return;
  }

  const body = {
    nombre_ruta: this.nombreRuta,
    perfil_id: "bcadd725-99a9-458f-bb7f-2eea173c0eb3",
    shape: {
      type: geometry.type,
      coordinates: geometry.coordinates
    }
  };

  this.api.guardarRuta(body).subscribe({
    next: resp => {
      console.log("Ruta guardada", resp);
      this.rutaGuardada.emit();
      this.closeSaveModal();
      this.mapService.resetMap();
      this.nombreRuta = "";
      this.modoDibujo = false;
      alert('Se ha registrado con exito');

    },
    error: err => {
      console.error("Error guardando ruta", err);
      alert("No se pudo guardar la ruta");
    }
  });
}

}
