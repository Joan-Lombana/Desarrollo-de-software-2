import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoBackLoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // o sessionStorage
    // Si existe token → redirige a principal
    if (token) {
      this.router.navigate(['/principal']);
      return false;  // 👈 BLOQUEA INMEDIATAMENTE
    }

    return true;
  }
}

