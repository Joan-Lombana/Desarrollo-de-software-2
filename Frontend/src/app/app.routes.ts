import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { PrincipalComponent } from './pages/principal/principal';
import { RutasComponent } from './pages/rutas/rutas';
import { VehiculosComponent } from './pages/vehiculos/vehiculos';
import { AuthCallback } from './components/authcallback/authcallback';

export const routes: Routes = [
  { path: "", component: InicioComponent },
  { path: "principal", component: PrincipalComponent },
  { path: "rutas", component: RutasComponent },
  { path: "vehiculos", component: VehiculosComponent },
  { path: "auth/callback", component: AuthCallback }
];
