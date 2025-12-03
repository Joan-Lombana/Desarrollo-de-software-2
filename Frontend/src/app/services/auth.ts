import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Signal para mantener el usuario actual
  currentUser = signal<any>(null);

  loginLocal(data: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, { withCredentials: true }).pipe(
      tap((response: any) => {
        if (response && response.user) {
          this.currentUser.set(response.user);
        }
      })
    );
  }

  register(data: { nombre: string; correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, { withCredentials: true });
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google/login`;
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { withCredentials: true }).pipe(
      tap((user: any) => {
        this.currentUser.set(user);
      })
    );
  }

logout(): Observable<boolean> {
  // Llamada al backend para cerrar sesión
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Limpiamos la señal del usuario
  this.currentUser.set(null);

  // Retornamos un observable para que .subscribe() funcione
  return of(true);
}

}
