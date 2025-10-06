import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
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
  onGoogleLogin() {
    console.log("Login con Google");
  }

  // mostrar y ocultar contraseña

  // Recuperar contraseña

}
