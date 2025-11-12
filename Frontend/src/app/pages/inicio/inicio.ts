import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';;
import { LoginComponent } from '../../components/login/login';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss'
})
export class InicioComponent {
  // componente contenedor
  // router-outlet muestra LoginComponent
}