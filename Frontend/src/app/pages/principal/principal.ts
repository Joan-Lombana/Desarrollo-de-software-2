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
  id: string;                   // UUID
  nombre_ruta: string; 
  horario: string; 
  zona: string; 
  estado: string; 
  shape: string;                // 👈 NECESARIO
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
  rutaId: string; 
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
  private mapService = inject(LeafletMapService);

  sidebarOpen = signal(true);
  vehiculoSeleccionado = signal<Vehiculo | null>(null);

  showRegistrarRutaModal = signal(false);
  showRegistrarVehiculoModal = signal(false);
  showIngresarDireccionModal = signal(false);
  showRouteTools = signal(false);
  
  formRuta = signal<FormRuta>({ nombre: '', zona: '', horario: '' });
  formVehiculo = signal<FormVehiculo>({ placa: '', modelo: '', marca: '', activo: true });
  formDireccion = signal<FormDireccion>({ rutaId: '', direccion: '', orden: 1 });
  
  rutas = signal<Ruta[]>([]);
  rutaSeleccionada = signal<string | null>(null);

  vehiculos = signal<Vehiculo[]>([]);
  stats = signal<Stats>({ vehiculosActivos: 0, rutasCompletadas: 0, rutasActivas: 0 });


  // ---------------------------------------------------------
  // INICIO
  // ---------------------------------------------------------
  ngOnInit() {
    this.cargarRutas();
    this.cargarVehiculos();
  }

  // ---------------------------------------------------------
  // CARGAR RUTAS
  // ---------------------------------------------------------
  cargarRutas() {
    this.rutasService.getRutas(this.perfilId).subscribe({
      
      next: (resp: any) => {
        console.log("📥 Rutas recibidas:", resp);

        const data = Array.isArray(resp.data) ? resp.data : [];

        this.rutas.set(data);

        console.log("📦 Rutas almacenadas en signal:", this.rutas());
      },

      error: (err) => {
        console.error('❌ Error cargando rutas', err);
        this.rutas.set([]);
      },
    });
  }

  // ---------------------------------------------------------
  // SELECCIONAR RUTA DESDE EL SELECT
  // ---------------------------------------------------------
  seleccionarRuta(event: Event) {
  const target = event.target as HTMLSelectElement;
  const rutaId = target.value; // UUID string

  this.rutaSeleccionada.set(rutaId);

  if (!rutaId) {
    console.log("↩ No se seleccionó ruta — limpiando mapa");
    this.mapService.resetMap();
    return;
  }

  console.log("📌 Ruta seleccionada:", rutaId);

  // Buscar en rutas cargadas
  const ruta = this.rutas().find(r => r.id === rutaId);

  if (!ruta) {
    console.error("❌ No se encontró la ruta en la lista cargada:", rutaId);
    return;
  }

  console.log("📄 Ruta encontrada:", ruta);

  if (!ruta.shape) {
    console.error("❌ Esta ruta no tiene shape:", ruta);
    return;
  }

  // Parsear shape
  let shape;
  try {
    shape = JSON.parse(ruta.shape);
  } catch (e) {
    console.error("❌ Error parseando shape:", e, ruta.shape);
    return;
  }

  // ✅ Enviar al servicio para mostrar en el mapa
  let coords: [number, number][] = [];

  if (shape.type === "LineString") {
    coords = shape.coordinates;
  } else if (shape.type === "MultiLineString") {
    // Para MultiLineString tomamos la primera línea (o podrías combinar todas)
    coords = shape.coordinates.flat();
  } else {
    console.error("❌ Tipo de geometría no soportado:", shape.type);
    return;
  }

  console.log("🗺 Coordenadas enviadas al mapa:", coords);

  this.mapService.showRoute(coords);
  }


  // ---------------------------------------------------------
  // VEHÍCULOS
  // ---------------------------------------------------------
  cargarVehiculos() {
    this.vehiculosService.getVehiculos(this.perfilId).subscribe({
      next: (resp: any) => {
        console.log('📥 Vehículos:', resp);

        const arr = Array.isArray(resp) ? resp : (resp.data || []);
        this.vehiculos.set(arr);

        if (arr.length > 0)
          this.vehiculoSeleccionado.set(arr[0]);

        this.actualizarStats();
      },

      error: (err) => {
        console.error('❌ Error cargando vehículos:', err);
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
    this.formDireccion.set({ rutaId: this.rutas()[0]?.id || '', direccion: '', orden: 1 });
    this.showIngresarDireccionModal.set(true); 
  }

  cerrarModalIngresarDireccion() { this.showIngresarDireccionModal.set(false); }

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

    if (!form.placa || !form.modelo || !form.marca) { 
      alert('Completa todos los campos'); 
      return; 
    }

    this.vehiculosService.registrarVehiculo(form, this.perfilId).subscribe({
      next: () => { 
        this.cargarVehiculos(); 
        this.cerrarModalRegistrarVehiculo(); 
      },
      error: () => alert('Error registrando vehículo')
    });
  }

  guardarDireccion() {
    const form = this.formDireccion();

    if (!form.direccion || !form.rutaId) { 
      alert('Completa todos los campos'); 
      return; 
    }

    this.cerrarModalIngresarDireccion();
  }

  
}
