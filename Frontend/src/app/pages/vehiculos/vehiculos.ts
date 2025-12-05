import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { VehiculosService } from '../../services/vehiculos.services';

interface Vehiculo { 
  id: string; 
  placa: string; 
  modelo: string; 
  marca: string; 
  activo: boolean; 
}

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './vehiculos.html',
  styleUrls: ['./vehiculos.scss']
})
export class VehiculosComponent implements OnInit {

  private vehiculosService = inject(VehiculosService);
  private perfilId = 'bcadd725-99a9-458f-bb7f-2eea173c0eb3';

  sidebarOpen = signal(true);
  vehiculos = signal<Vehiculo[]>([]);
  editando = signal<Vehiculo | null>(null);

  ngOnInit() { 
    this.cargarVehiculos(); 
  }

  cargarVehiculos() {
    this.vehiculosService.getVehiculos(this.perfilId).subscribe({
      next: (resp: any) => {
        const arr = Array.isArray(resp) ? resp : (resp.data || resp.vehiculos || []);
        this.vehiculos.set(arr);
      },
      error: () => this.vehiculos.set([])
    });
  }

  toggleSidebar() { 
    this.sidebarOpen.update(v => !v); 
  }

  eliminarVehiculo(v: Vehiculo) {
    console.log('🟢 Intentando eliminar vehículo:', v);
    if (confirm(`¿Eliminar vehículo ${v.placa}?`)) {
      console.log('✅ Confirmado eliminar vehículo ID:', v.id);
      this.vehiculosService.eliminarVehiculo(v.id, this.perfilId).subscribe({  // <- PASAR perfilId
        next: () => {
          console.log('🚀 Vehículo eliminado correctamente');
          this.cargarVehiculos();
        },
        error: (err) => {
          console.error('❌ Error eliminando vehículo:', err);
          alert('Error eliminando vehículo');
        }
      });
    }
  }

  editarVehiculo(v: Vehiculo) {
    // Crear una copia del objeto para editar
    this.editando.set({ ...v });
  }

  actualizarCampo(key: keyof Vehiculo, value: any) {
    const v = this.editando();
    if (!v) return;
    this.editando.set({ ...v, [key]: value });
  }

  cancelarEdicion() { 
    this.editando.set(null); 
  }

  guardarEdicion() {
    const v = this.editando();
    if (!v) return;

    this.vehiculosService.actualizarVehiculo(v.id, v, this.perfilId).subscribe({ // <- PASAR perfilId
      next: () => {
        this.editando.set(null);
        this.cargarVehiculos();
      },
      error: () => alert('Error actualizando vehículo')
    });
  }
}

