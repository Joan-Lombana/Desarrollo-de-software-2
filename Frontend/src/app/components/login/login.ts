import { Component, inject, signal, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  
  // Output para cerrar modal cuando sea exitoso
  loginSuccess = output<void>();
  
  // Señales para el estado del componente
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  mostrarRegistro = signal(false);
  
  // Datos del formulario de login
  loginData = {
    correo: '',
    contrasena: ''
  };

  // Datos del formulario de registro
  registroData = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  /**
   * Cambiar a vista de login
   */
  cambiarALogin() {
    this.mostrarRegistro.set(false);
    this.errorMessage.set(null);
  }

  /**
   * Cambiar a vista de registro
   */
  cambiarARegistro() {
    this.mostrarRegistro.set(true);
    this.errorMessage.set(null);
  }

  /**
   * Iniciar sesión con correo y contraseña
   */
  onLogin() {
    // Limpiar error previo
    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Llamada al backend
    this.auth.loginLocal(this.loginData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.loginSuccess.emit();
        this.router.navigateByUrl('/principal');
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos');
        console.error('Error en login:', err);
      }
    });
  }

  /**
   * Registrar nuevo usuario
   */
  onRegistro() {
    // Validar que las contraseñas coincidan
    if (this.registroData.contrasena !== this.registroData.confirmarContrasena) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    // Preparar datos para el registro
    const datosRegistro = {
      nombre: this.registroData.nombre,
      correo: this.registroData.correo,
      contrasena: this.registroData.contrasena
    };

    // Llamada al backend para registrar
    this.auth.register(datosRegistro).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Después del registro exitoso, iniciar sesión automáticamente
        this.loginData.correo = this.registroData.correo;
        this.loginData.contrasena = this.registroData.contrasena;
        this.onLogin();
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al crear la cuenta. Intenta de nuevo.');
        console.error('Error en registro:', err);
      }
    });
  }

  /**
   * Login con Google
   */
  loginWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.auth.loginWithGoogle();
      // El redirect lo maneja el backend
    } catch (error) {
      console.error('Error en login con Google:', error);
      this.errorMessage.set('Error al iniciar sesión con Google');
      this.isLoading.set(false);
    }
  }

  /**
   * Mostrar/ocultar contraseña
   */
  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  /**
   * Recuperar contraseña
   */
  onRecuperarContrasena() {
    // TODO: Implementar flujo de recuperación
    alert('Función de recuperación de contraseña - Implementar con backend');
  }
}
