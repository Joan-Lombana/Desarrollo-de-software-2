import { Component } from '@angular/core';
import { RutasService } from '../../services/rutas';
import { RutasComponent } from '../../components/rutas/rutas';
import { Mapa } from '../../components/mapa/mapa';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [ Mapa],
  templateUrl: './principal.html',
  styleUrls: ['./principal.scss'] // 👈 ojo, es "styleUrls" (plural)
})
export class PrincipalComponent {

  rutas: any[] = [];
  cargado = false;

  constructor(private rutasService: RutasService) {}

  cargarRutas() {
    this.rutasService.obtenerRutas().subscribe({
      next: (data) => {
        this.rutas = data;
        this.cargado = true;
      },
      error: (err) => {
        console.error('Error al cargar rutas', err);
        this.cargado = true;
      },
    });
  }


}

