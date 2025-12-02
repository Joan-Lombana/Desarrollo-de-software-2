import { Component, signal, OnInit, OnDestroy } from '@angular/core';

import { LoginComponent } from '../../components/login/login';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class InicioComponent implements OnInit, OnDestroy {
  // Estado del navbar
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  
  // Control del modal de login
  showLoginModal = signal(false);
  
  // Estadísticas desde el backend (vacías hasta que se conecte)
  stats = signal({
    usuariosActivos: 0,
    rutasCubiertas: 0,
    satisfaccion: 0
  });

  ngOnInit() {
    // Listener para el scroll
    window.addEventListener('scroll', this.handleScroll);
    
    // TODO: Cargar estadísticas reales del backend
    // this.loadStatsFromBackend();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = () => {
    this.isScrolled.set(window.scrollY > 50);
  }

  // TODO: Método para cargar stats desde el backend
  private loadStatsFromBackend() {
    // this.statsService.getPublicStats().subscribe({
    //   next: (data) => this.stats.set(data),
    //   error: (err) => console.error('Error cargando estadísticas', err)
    // });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(value => !value);
  }

  openLoginModal() {
    this.showLoginModal.set(true);
    this.mobileMenuOpen.set(false);
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }

  closeLoginModal() {
    this.showLoginModal.set(false);
    document.body.style.overflow = 'auto';
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.mobileMenuOpen.set(false);
    }
  }
}