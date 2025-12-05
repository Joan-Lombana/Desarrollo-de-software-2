import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { RutasService } from '../../services/rutas.services';

interface Ruta { id: number; nombre: string; horario: string; zona: string; estado: string; }

@Component({
  selector: 'app-rutas',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './rutas.html',
  styleUrls: ['./rutas.scss']
})
export class RutasComponent implements OnInit {
  private rutasService = inject(RutasService);
  sidebarOpen = signal(true);
  rutas = signal<Ruta[]>([]);
  editando = signal<Ruta | null>(null);

  ngOnInit() { this.cargarRutas(); }

  cargarRutas() {
    this.rutasService.getRutas().subscribe({
      next: (resp: any) => {
        const arr = Array.isArray(resp) ? resp : (resp.data || resp.rutas || []);
        this.rutas.set(arr);
      },
      error: () => this.rutas.set([])
    });
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }

  eliminarRuta(ruta: Ruta) {
    if (confirm(`¿Eliminar ruta "${ruta.nombre}"?`)) {
      this.rutasService.eliminarRuta(ruta.id).subscribe({
        next: () => this.cargarRutas(),
        error: () => alert('Error eliminando ruta')
      });
    }
  }

  editarRuta(ruta: Ruta) { this.editando.set({...ruta}); }
  cancelarEdicion() { this.editando.set(null); }

  guardarEdicion() {
    const ruta = this.editando();
    if (!ruta) return;
    this.rutasService.actualizarRuta(ruta.id, ruta).subscribe({
      next: () => { this.editando.set(null); this.cargarRutas(); },
      error: () => alert('Error actualizando ruta')
    });
  }

  visualizarRuta(ruta: Ruta) { console.log('Visualizar:', ruta); }
}
