import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  private baseUrl = `${environment.apiUrl}/operativo`;

  constructor(private http: HttpClient) {}

  // Registrar vehículo (perfil_id en body)
  registrarVehiculo(vehiculo: any, perfilId: string) {
    const body = { ...vehiculo, perfil_id: perfilId };

    console.log("📤 Enviando POST a:", `${this.baseUrl}/vehiculos/crear`);
    console.log("📦 Body del POST:", body);

    return this.http.post(`${this.baseUrl}/vehiculos/crear`, body);
  }

  // Obtener vehículos (perfil_id como query param)
  getVehiculos(perfilId: string) {
    const params = new HttpParams().set('perfil_id', perfilId);

    console.log("📥 Consultando vehiculos:", `${this.baseUrl}/vehiculos`, "con params:", params.toString());
    return this.http.get(`${this.baseUrl}/vehiculos`, { params });
  }

  eliminarVehiculo(vehiculoId: string, perfilId: string) {
    const params = new HttpParams().set('perfil_id', perfilId);

    console.log("🗑️ Enviando DELETE a:", `${this.baseUrl}/vehiculos/${vehiculoId}`, "con params:", params.toString());
    return this.http.delete(`${this.baseUrl}/vehiculos/${vehiculoId}`, { params });
  }
}
