import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  private baseUrl = `${environment.apiUrl}/operativo`;
  constructor(private http: HttpClient) {}
  
  guardarRuta(body: any) {
  console.log("📤 Enviando POST a:", `${this.baseUrl}/rutas`);
  console.log("📦 Body del POST:", body);
  return this.http.post(`${this.baseUrl}/rutas`, body);
  }
 
  getRutas() {
    console.log("📥 Consultando rutas:", `${this.baseUrl}/rutas`);
    return this.http.get(`${this.baseUrl}/rutas`);
  }


}


