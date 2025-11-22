import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loginData = { correo: '', contrasena: '' };

  onLoginLocal() {
    this.auth.loginLocal(this.loginData).subscribe({
      next: () => this.router.navigateByUrl('/principal'),
      error: () => alert('Correo o contraseña incorrectos')
    });
  }

  loginGoogle() {
    this.auth.loginWithGoogle();
  }
}


