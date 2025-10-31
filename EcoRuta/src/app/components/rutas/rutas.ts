import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RutasService } from '../../services/rutas';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rutas',
  imports: [CommonModule, RouterLink],
  templateUrl: './rutas.html',
  styleUrl: './rutas.scss'
})

export class RutasComponent implements OnInit{
  rutas: any[] = [];

  constructor(private rutasService: RutasService) {}

  ngOnInit() {
    this.rutasService.obtenerRutas().subscribe({
      next: (data) => this.rutas = data,
      error: (err) => console.error('Error al cargar rutas', err),
    });
  }
}
