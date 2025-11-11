import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RutasService {
  private apiUrl = 'http://localhost:3000/operativo';
 

  constructor(private http: HttpClient) {}

  obtenerRutas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearRuta(ruta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ruta);
  }
}

