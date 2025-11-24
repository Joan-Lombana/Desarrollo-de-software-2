import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MapaComponent } from '../../components/mapa/mapa';

interface Ruta {
  id: number;
  nombre: string;
  horario: string;
  zona: string;
  estado: 'activa' | 'programada' | 'completada';
  progreso: number;
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

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, MapaComponent],
  templateUrl: './principal.html',
  styleUrls: ['./principal.scss']
})
export class PrincipalComponent implements OnInit {
  private router = inject(Router);

  // Estado del sidebar
  sidebarOpen = signal(true);
  
  // Vehículo seleccionado
  vehiculoSeleccionado = signal<Vehiculo | null>(null);
  
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
}