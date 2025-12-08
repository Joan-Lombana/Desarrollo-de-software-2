import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MapaComponent } from '../../components/mapa/mapa';
import { Herramientasmapa } from '../../components/herramientasmapa/herramientasmapa';
import { VehiculosService } from '../../services/vehiculos.services';
import { RutasService } from '../../services/rutas.services';
import { LeafletMapService } from '../../services/leaflet-map.services';

interface Ruta { 
  id: number; 
  nombre: string; 
  horario: string; 
  zona: string; 
  estado: string; 
}
interface Vehiculo { 
  id: string; 
  placa: string; 
  modelo: string; 
  marca: string; 
  activo: boolean;
}
interface Stats { 
  vehiculosActivos: number; 
  rutasCompletadas: number; 
  rutasActivas: number; 
}
interface FormRuta { 
  nombre: string; 
  zona: string; 
  horario: string; 
}
interface FormVehiculo { 
  placa: string; 
  modelo: string; 
  marca: string; 
  activo: boolean; 
}
interface FormDireccion { 
  rutaId: number; 
  direccion: string; 
  orden: number; 
}

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MapaComponent, CommonModule, Herramientasmapa],
  templateUrl: './principal.html',
  styleUrls: ['./principal.scss']
})
export class PrincipalComponent implements OnInit {
  private vehiculosService = inject(VehiculosService);
  private rutasService = inject(RutasService);
  private leafletMapService = inject(LeafletMapService);
  private perfilId = 'bcadd725-99a9-458f-bb7f-2eea173c0eb3';

  sidebarOpen = signal(true);
  vehiculoSeleccionado = signal<Vehiculo | null>(null);
  showRegistrarRutaModal = signal(false);
  showRegistrarVehiculoModal = signal(false);
  showIngresarDireccionModal = signal(false);
  showRouteTools = signal(false);
  
  formRuta = signal<FormRuta>({ nombre: '', zona: '', horario: '' });
  formVehiculo = signal<FormVehiculo>({ placa: '', modelo: '', marca: '', activo: true });
  formDireccion = signal<FormDireccion>({ rutaId: 0, direccion: '', orden: 1 });
  
  rutas = signal<Ruta[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  stats = signal<Stats>({ vehiculosActivos: 0, rutasCompletadas: 0, rutasActivas: 0 });

  ngOnInit() {
    this.cargarRutas();
    this.cargarVehiculos();
  }

  cargarRutas() {
    this.rutasService.getRutas(this.perfilId).subscribe({
      next: (resp: any) => {
        console.log('Rutas recibidas:', resp);
        const arr = Array.isArray(resp) ? resp : (resp.data || resp.rutas || []);
        this.rutas.set(arr);
        this.actualizarStats();
      },
      error: (err) => {
        console.error('Error cargando rutas:', err);
        this.rutas.set([]);
      }
    });
  }

  cargarVehiculos() {
    this.vehiculosService.getVehiculos(this.perfilId).subscribe({
      next: (resp: any) => {
        console.log('Vehículos recibidos:', resp); // Para depuración
        const arr = Array.isArray(resp) ? resp : (resp.data || resp.vehiculos || []);
        this.vehiculos.set(arr);
        if (arr.length > 0) this.vehiculoSeleccionado.set(arr[0]);
        this.actualizarStats();
      },
      error: (err) => {
        console.error('Error cargando vehículos:', err);
        this.vehiculos.set([]);
      }
    });
  }

  actualizarStats() {
    const vehiculosActivos = 
    this.vehiculos().filter(v => v.activo).length;
    const rutasCompletadas = 
    this.rutas().filter(r => r.estado === 'completada').length;
    const rutasActivas = 
    this.rutas().filter(r => r.estado === 'activa' || r.estado === 'programada').length;
    this.stats.set({ vehiculosActivos, rutasCompletadas, rutasActivas });
  }

  toggleSidebar() { 
    this.sidebarOpen.update(v => !v);
    // Redimensionar el mapa cuando el sidebar cambia de estado
    this.leafletMapService.resizeMap();
  }
  seleccionarVehiculo(v: Vehiculo) { this.vehiculoSeleccionado.set(v); }

  abrirModalRegistrarRuta() { 
    this.formRuta.set({ nombre: '', zona: '', horario: '' }); 
    this.showRegistrarRutaModal.set(true); 
  }
  cerrarModalRegistrarRuta() { 
    this.showRegistrarRutaModal.set(false); 
  }
  trazarRuta() { 
    this.showRouteTools.set(true); 
    this.showRegistrarRutaModal.set(false); 
  }

  abrirModalRegistrarVehiculo() { 
    this.formVehiculo.set({ placa: '', modelo: '', marca: '', activo: true }); 
    this.showRegistrarVehiculoModal.set(true); 
  }
  cerrarModalRegistrarVehiculo() { 
    this.showRegistrarVehiculoModal.set(false); 
  }

  abrirModalIngresarDireccion() { 
    this.formDireccion.set({ 
      rutaId: this.rutas()[0]?.id || 0, 
      direccion: '', 
      orden: 1 }); 
      this.showIngresarDireccionModal.set(true); 
    }
  cerrarModalIngresarDireccion() { 
    this.showIngresarDireccionModal.set(false); 
  }

  guardarRuta() {
    const form = this.formRuta();
    if (!form.nombre || !form.zona || !form.horario) { alert('Completa todos los campos'); return; }
    this.rutasService.guardarRuta({ 
      nombre: form.nombre, 
      zona: form.zona, 
      horario: form.horario, 
      estado: 'programada' }).subscribe({
      next: () => { 
        this.cargarRutas(); 
        this.cerrarModalRegistrarRuta(); 
      },
      error: () => alert('Error guardando ruta')
    });
  }

  guardarVehiculo() {
    const form = this.formVehiculo();
    if (!form.placa || !form.modelo || !form.marca) { alert('Completa todos los campos'); return; }
    this.vehiculosService.registrarVehiculo(form, this.perfilId).subscribe({
      next: () => { this.cargarVehiculos(); this.cerrarModalRegistrarVehiculo(); 
      },
      error: () => alert('Error registrando vehículo')
    });
  }

  guardarDireccion() {
    const form = this.formDireccion();
    if (!form.direccion || form.rutaId === 0) { 
      alert('Completa todos los campos'); return; 
    }
    this.cerrarModalIngresarDireccion();
  }
}