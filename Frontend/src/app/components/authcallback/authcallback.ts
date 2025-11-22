import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authcallback.html',
  styleUrls: ['./authcallback.scss']
})
export class AuthCallback {
  private auth = inject(AuthService);
  private router = inject(Router);

  loginData = {
    correo: '',
    contrasena: ''
  };

  // Login local
  onLoginLocal() {
    this.auth.loginLocal(this.loginData).subscribe({
      next: () => this.router.navigateByUrl('/principal'),
      error: () => alert('Correo o contraseña incorrectos')
    });
  }

  // Login con Google
  loginGoogle() {
    this.auth.loginWithGoogle();
  }
}



