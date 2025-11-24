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
    { label: 'Mapa', route: '/mapa', icon: 'map', badge: 0 },
    { label: 'Rutas', route: '/rutas', icon: 'route', badge: 0 },
    { label: 'Avisos', route: '/avisos', icon: 'bell', badge: 2 },
    { label: 'Vehículos', route: '/vehiculos', icon: 'truck', badge: 0 },
    { label: 'Conductores', route: '/conductores', icon: 'users', badge: 0 },
    { label: 'Reportes', route: '/reportes', icon: 'chart', badge: 0 }
  ];

  onNavigate() {
    // Cerrar sidebar en mobile después de navegar
    if (window.innerWidth < 1024) {
      this.closeSidebar.emit();
    }
  }
}