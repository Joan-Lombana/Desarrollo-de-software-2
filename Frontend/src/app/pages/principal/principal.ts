import { Component, signal, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MapaComponent } from '../../components/mapa/mapa';
import { Herramientasmapa } from '../../components/herramientasmapa/herramientasmapa';

interface Ruta {
  id: number;
  nombre: string;
  horario: string;
  zona: string;
  estado: 'activa' | 'programada' | 'completada';
  progreso: number;
  puntos?: Direccion[];
}

interface Vehiculo {
  id: string;
  placa: string;
  capacidad: number;
  estado: 'En ruta' | 'En espera' | 'Mantenimiento';
  conductor: string;
  rutaActual?: string;
  ubicacion?: { lat: number; lng: number };
}

interface Aviso {
  id: number;
  tipo: 'warning' | 'info' | 'success';
  titulo: string;
  mensaje: string;
  hora: string;
  leido: boolean;
}

interface Stats {
  vehiculosActivos: number;
  rutasCompletadas: number;
  eficiencia: number;
  kmRecorridos: number;
  kgRecolectados: number;
}

interface FormRuta {
  nombre: string;
  zona: string;
  horario: string;
}

interface FormVehiculo {
  placa: string;
  capacidad: number;
  conductor: string;
  estado: 'En ruta' | 'En espera' | 'Mantenimiento';
}

interface Direccion {
  direccion: string;
  orden: number;
  lat?: number;
  lng?: number;
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
  private router = inject(Router);

 
 
  // Estado del sidebar
  sidebarOpen = signal(true);
  
  // Vehículo seleccionado
  vehiculoSeleccionado = signal<Vehiculo | null>(null);
  
  // Control de modales
  showRegistrarRutaModal = signal(false);
  showRegistrarVehiculoModal = signal(false);
  showIngresarDireccionModal = signal(false);
  
  // Datos de formularios
  formRuta = signal<FormRuta>({ nombre: '', zona: '', horario: '' });
  formVehiculo = signal<FormVehiculo>({ placa: '', capacidad: 0, conductor: '', estado: 'En espera' });
  formDireccion = signal<FormDireccion>({ rutaId: 0, direccion: '', orden: 1 });
  
  // Datos (TODO: vienen del backend)
  rutas = signal<Ruta[]>([]);
  vehiculos = signal<Vehiculo[]>([]);
  avisos = signal<Aviso[]>([]);
  stats = signal<Stats>({
    vehiculosActivos: 0,
    rutasCompletadas: 0,
    eficiencia: 0,
    kmRecorridos: 0,
    kgRecolectados: 0
  });

  ngOnInit() {
    this.cargarDatos();
    
    // TODO: Configurar WebSocket o polling para datos en tiempo real
    // this.configurarActualizacionTiempoReal();
  }

  cargarDatos() {
    // TODO: Reemplazar con llamadas al backend
    this.cargarRutas();
    this.cargarVehiculos();
    this.cargarAvisos();
    this.cargarEstadisticas();
  }

  private cargarRutas() {
    // Simulación - reemplazar con servicio real
    this.rutas.set([
      {
        id: 1,
        nombre: 'Ruta Norte',
        horario: '10:30 AM',
        zona: 'Zona Norte',
        estado: 'activa',
        progreso: 65
      },
      {
        id: 2,
        nombre: 'Ruta Centro',
        horario: '11:00 AM',
        zona: 'Zona Centro',
        estado: 'programada',
        progreso: 0
      },
      {
        id: 3,
        nombre: 'Ruta Sur',
        horario: '09:00 AM',
        zona: 'Zona Sur',
        estado: 'completada',
        progreso: 100
      }
    ]);
  }

  private cargarVehiculos() {
    const vehiculosData: Vehiculo[] = [
      {
        id: '1',
        placa: 'ABC-123',
        capacidad: 68,
        estado: 'En ruta',
        conductor: 'J. Pérez',
        rutaActual: 'Ruta Norte',
        ubicacion: { lat: 3.42158, lng: -76.5205 }
      },
      {
        id: '2',
        placa: 'XYZ-789',
        capacidad: 45,
        estado: 'En espera',
        conductor: 'M. González',
        ubicacion: { lat: 3.43158, lng: -76.5305 }
      },
      {
        id: '3',
        placa: 'DEF-456',
        capacidad: 90,
        estado: 'En ruta',
        conductor: 'L. Ramírez',
        rutaActual: 'Ruta Centro',
        ubicacion: { lat: 3.41158, lng: -76.5105 }
      }
    ];
    
    this.vehiculos.set(vehiculosData);
    
    // Seleccionar el primer vehículo activo
    const primerActivo = vehiculosData.find(v => v.estado === 'En ruta');
    if (primerActivo) {
      this.vehiculoSeleccionado.set(primerActivo);
    }
  }

  private cargarAvisos() {
    this.avisos.set([
      {
        id: 1,
        tipo: 'warning',
        titulo: 'Geofencing alert',
        mensaje: 'Vehículo ABC-123 cruzó geocerca en Almacén A',
        hora: '15:48',
        leido: false
      },
      {
        id: 2,
        tipo: 'success',
        titulo: 'Ruta completada',
        mensaje: 'Camión DEF-456 finalizó Ruta Sur exitosamente',
        hora: '14:20',
        leido: false
      },
      {
        id: 3,
        tipo: 'info',
        titulo: 'Mantenimiento programado',
        mensaje: 'Vehículo XYZ-789 requiere revisión en 3 días',
        hora: '12:05',
        leido: true
      }
    ]);
  }

  private cargarEstadisticas() {
    // TODO: Obtener del backend
    this.stats.set({
      vehiculosActivos: 3,
      rutasCompletadas: 12,
      eficiencia: 86,
      kmRecorridos: 142,
      kgRecolectados: 1850
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }

  seleccionarVehiculo(vehiculo: Vehiculo) {
    this.vehiculoSeleccionado.set(vehiculo);
    // TODO: Actualizar mapa para centrar en el vehículo
  }

  verRuta(rutaId: number) {
    this.router.navigate(['/rutas', rutaId]);
  }

  marcarAvisoLeido(avisoId: number) {
    this.avisos.update(avisos =>
      avisos.map(a => a.id === avisoId ? { ...a, leido: true } : a)
    );
  }

  eliminarAviso(avisoId: number) {
    this.avisos.update(avisos => avisos.filter(a => a.id !== avisoId));
  }

  // Computed values
  get avisosNoLeidos() {
    return this.avisos().filter(a => !a.leido);
  }

  get vehiculosEnRuta() {
    return this.vehiculos().filter(v => v.estado === 'En ruta').length;
  }

  get rutasActivas() {
    return this.rutas().filter(r => r.estado === 'activa').length;
  }

  // ========== MODAL CONTROLS ==========
  
  abrirModalRegistrarRuta() {
    this.formRuta.set({ nombre: '', zona: '', horario: '' });
    this.showRegistrarRutaModal.set(true);
  }

  cerrarModalRegistrarRuta() {
    this.showRegistrarRutaModal.set(false);
  }

  abrirModalRegistrarVehiculo() {
    this.formVehiculo.set({ placa: '', capacidad: 0, conductor: '', estado: 'En espera' });
    this.showRegistrarVehiculoModal.set(true);
  }

  cerrarModalRegistrarVehiculo() {
    this.showRegistrarVehiculoModal.set(false);
  }

  abrirModalIngresarDireccion() {
    const primeraRuta = this.rutas()[0];
    this.formDireccion.set({ 
      rutaId: primeraRuta?.id || 0, 
      direccion: '', 
      orden: 1 
    });
    this.showIngresarDireccionModal.set(true);
  }

  cerrarModalIngresarDireccion() {
    this.showIngresarDireccionModal.set(false);
  }

  // ========== FORM HANDLERS ==========
  
  guardarRuta() {
    const form = this.formRuta();
    
    // Validación básica
    if (!form.nombre || !form.zona || !form.horario) {
      alert('Por favor completa todos los campos');
      return;
    }

    // TODO: Llamar al backend
    const nuevaRuta: Ruta = {
      id: this.rutas().length + 1,
      nombre: form.nombre,
      zona: form.zona,
      horario: form.horario,
      estado: 'programada',
      progreso: 0,
      puntos: []
    };

    this.rutas.update(rutas => [...rutas, nuevaRuta]);
    
    // Mostrar mensaje de éxito
    this.avisos.update(avisos => [{
      id: Date.now(),
      tipo: 'success',
      titulo: 'Ruta registrada',
      mensaje: `La ruta "${form.nombre}" ha sido registrada exitosamente`,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    }, ...avisos]);

    this.cerrarModalRegistrarRuta();
  }

  guardarVehiculo() {
    const form = this.formVehiculo();
    
    // Validación básica
    if (!form.placa || !form.conductor || form.capacidad <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    // TODO: Llamar al backend
    const nuevoVehiculo: Vehiculo = {
      id: (this.vehiculos().length + 1).toString(),
      placa: form.placa,
      capacidad: 0, // Capacidad actual en 0%
      estado: form.estado,
      conductor: form.conductor
    };

    this.vehiculos.update(vehiculos => [...vehiculos, nuevoVehiculo]);
    
    // Actualizar estadísticas
    if (form.estado === 'En ruta') {
      this.stats.update(s => ({ ...s, vehiculosActivos: s.vehiculosActivos + 1 }));
    }

    // Mostrar mensaje de éxito
    this.avisos.update(avisos => [{
      id: Date.now(),
      tipo: 'success',
      titulo: 'Vehículo registrado',
      mensaje: `Vehículo ${form.placa} registrado con conductor ${form.conductor}`,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    }, ...avisos]);

    this.cerrarModalRegistrarVehiculo();
  }

  guardarDireccion() {
    const form = this.formDireccion();
    
    // Validación básica
    if (!form.direccion || form.rutaId === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    // TODO: Llamar al backend para geocoding y guardar
    const nuevaDireccion: Direccion = {
      direccion: form.direccion,
      orden: form.orden
    };

    // Agregar dirección a la ruta seleccionada
    this.rutas.update(rutas => rutas.map(r => {
      if (r.id === form.rutaId) {
        return {
          ...r,
          puntos: [...(r.puntos || []), nuevaDireccion]
        };
      }
      return r;
    }));

    const rutaSeleccionada = this.rutas().find(r => r.id === form.rutaId);
    
    // Mostrar mensaje de éxito
    this.avisos.update(avisos => [{
      id: Date.now(),
      tipo: 'success',
      titulo: 'Dirección agregada',
      mensaje: `Punto de recolección agregado a "${rutaSeleccionada?.nombre}"`,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    }, ...avisos]);

    this.cerrarModalIngresarDireccion();
  }

  iniciarRecorrido(rutaId: number) {
    const ruta = this.rutas().find(r => r.id === rutaId);
    
    if (!ruta) return;
    
    if (ruta.estado !== 'programada') {
      alert('Solo se pueden iniciar rutas en estado "programada"');
      return;
    }

    const confirmar = confirm(`¿Iniciar recorrido en ${ruta.nombre}?`);
    
    if (!confirmar) return;

    // TODO: Llamar al backend
    this.rutas.update(rutas => rutas.map(r => {
      if (r.id === rutaId) {
        return { ...r, estado: 'activa' as const, progreso: 0 };
      }
      return r;
    }));

    // Mostrar mensaje de éxito
    this.avisos.update(avisos => [{
      id: Date.now(),
      tipo: 'info',
      titulo: 'Recorrido iniciado',
      mensaje: `El recorrido en "${ruta.nombre}" ha comenzado`,
      hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      leido: false
    }, ...avisos]);
  }
}