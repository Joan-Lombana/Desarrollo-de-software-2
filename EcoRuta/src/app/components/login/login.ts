import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private auth = inject(AuthService);
  // datos del formulario
  loginData = {
    usuario: "",
    contrasena: ""
  };
  router = inject(Router);

  // Metodo para iniciar sesion
  onLogin() {
      // (Organizar bien)!!!!
      if (this.loginData.usuario === "Admin" && this.loginData.contrasena === "1234567") {
        // redirigir a pagina principal
        this.router.navigateByUrl('/principal');
        localStorage.setItem('usuario', "Admin");
      } else {
       alert("ESO TA MAL"); 
      }
    }
  

  // login con Google
    login() {
    this.auth.loginWithGoogle();
  }

  // mostrar y ocultar contraseña

  // Recuperar contraseña

}
