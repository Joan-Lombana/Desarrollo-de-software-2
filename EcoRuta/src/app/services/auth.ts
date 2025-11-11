import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  // Redirige al backend para iniciar sesión con Google
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google/login`;
  }

  // Obtiene el usuario autenticado (una vez logueado)
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true });
  }

  // Cierra sesión
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }
}
