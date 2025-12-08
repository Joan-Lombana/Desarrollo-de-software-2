import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RutasService {
  private baseUrl = `${environment.apiUrl}/operativo`;
  constructor(private http: HttpClient) {}
  
  
  guardarRuta(body: any) {
  console.log("📤 Enviando POST a:", `${this.baseUrl}/rutas`);
  console.log("📦 Body del POST:", body);
  return this.http.post(`${this.baseUrl}/rutas`, body);
  }
 
  getRutas(perfilId: string) {
    const params = new HttpParams().set('perfil_id', perfilId);
    console.log("📥 Consultando rutas:", `${this.baseUrl}/rutas`,  "params:", params.toString());
    return this.http.get(`${this.baseUrl}/rutas`, {params});
  }
  

  actualizarRuta(id: number, body: any) {
    return this.http.put(`${this.baseUrl}/rutas/${id}`, body);
  }

  eliminarRuta(id: number) {
    return this.http.delete(`${this.baseUrl}/rutas/${id}`);
  }
}