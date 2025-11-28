import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  isOpen = input<boolean>(true);
  
  // Emite evento para cerrar en mobile
  closeSidebar = output<void>();

  // Menú de navegación
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/principal', icon: 'dashboard', badge: 0 },
    { label: 'Gestión de Rutas', route: '/rutas', icon: 'map', badge: 0 },
    { label: 'Seguimiento', route: '/tracking', icon: 'route', badge: 0 },
    { label: 'Vehículos', route: '/vehiculos', icon: 'truck', badge: 0 },
    { label: 'Historial', route: '/historial', icon: 'chart', badge: 0 },
    { label: 'Configuración', route: '/settings', icon: 'users', badge: 0 }
  ];

  onNavigate() {
    // Cerrar sidebar en mobile después de navegar
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }
}