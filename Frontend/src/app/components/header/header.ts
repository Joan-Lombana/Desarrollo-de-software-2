import { Component, inject, signal, output, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Señales
  searchQuery = signal('');
  showUserMenu = signal(false);
  showNotifications = signal(false);
  
  // Datos del usuario desde el servicio de auth
  currentUser = this.authService.currentUser;
  
  // Notificaciones simuladas (luego vendrán del backend)
  notifications = signal([
    {
      id: 1,
      title: 'Geofencing alert',
      message: 'Truck crossed geofence at Warehouse A',
      time: '15:48',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Ruta completada',
      message: 'Camión ABC-123 finalizó Ruta Norte',
      time: '14:20',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Mantenimiento programado',
      message: 'Vehículo XYZ-789 requiere revisión',
      time: '12:05',
      type: 'info',
      read: true
    }
  ]);

  // Output para toggle del sidebar en mobile
  toggleSidebar = output<void>();

  // Contador de notificaciones sin leer
  unreadCount = signal(2);

  ngOnInit() {
    if (!this.authService.currentUser()) {
      this.authService.getProfile().subscribe({
        error: () => console.log('No active session')
      });
    }
  }

  onSearch() {
    console.log('Buscando:', this.searchQuery());
    // TODO: Implementar búsqueda
  }

  toggleUserMenu() {
    this.showUserMenu.update(value => !value);
    if (this.showNotifications()) {
      this.showNotifications.set(false);
    }
  }

  toggleNotifications() {
    this.showNotifications.update(value => !value);
    if (this.showUserMenu()) {
      this.showUserMenu.set(false);
    }
  }

  markAsRead(notificationId: number) {
    this.notifications.update(notifs => 
      notifs.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    this.updateUnreadCount();
  }

  markAllAsRead() {
    this.notifications.update(notifs => 
      notifs.map(n => ({ ...n, read: true }))
    );
    this.unreadCount.set(0);
  }

  private updateUnreadCount() {
    const unread = this.notifications().filter(n => !n.read).length;
    this.unreadCount.set(unread);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goToProfile() {
    this.showUserMenu.set(false);
    this.router.navigate(['/perfil']);
  }

  goToSettings() {
    this.showUserMenu.set(false);
    this.router.navigate(['/configuracion']);
  }
}