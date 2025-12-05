import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehiculosService {
  private baseUrl = `${environment.apiUrl}/operativo`;

  constructor(private http: HttpClient) {}

  // -------------------------------
  // 📌 Crear vehículo
  // -------------------------------
  registrarVehiculo(vehiculo: any, perfilId: string) {
    const body = { ...vehiculo, perfil_id: perfilId };

    console.log("📤 POST ->", `${this.baseUrl}/vehiculos/crear`, body);
    return this.http.post(`${this.baseUrl}/vehiculos/crear`, body);
  }

  // -------------------------------
  // 📌 Listar vehículos por perfil
  // -------------------------------
  getVehiculos(perfilId: string) {
    const params = new HttpParams().set('perfil_id', perfilId);

    console.log("📥 GET ->", `${this.baseUrl}/vehiculos`, "params:", params.toString());
    return this.http.get(`${this.baseUrl}/vehiculos`, { params });
  }

  // -------------------------------
  // 📌 Actualizar vehículo
  // -------------------------------
  actualizarVehiculo(vehiculoId: string, datos: any, perfilId: string) {
      const params = new HttpParams().set('perfil_id', perfilId);
      console.log("✏️ PUT ->", `${this.baseUrl}/vehiculos/${vehiculoId}`, "body:", datos, "perfil_id:", perfilId);
      return this.http.put(`${this.baseUrl}/vehiculos/${vehiculoId}`, datos, { params });
    }

  // -------------------------------
  // 📌 Eliminar vehículo
  // -------------------------------
  eliminarVehiculo(vehiculoId: string, perfilId: string) {
    const params = new HttpParams().set('perfil_id', perfilId);
    console.log("🗑️ DELETE ->", `${this.baseUrl}/vehiculos/${vehiculoId}`, "perfil_id:", perfilId);
    return this.http.delete(`${this.baseUrl}/vehiculos/${vehiculoId}`, { params });
  }
}