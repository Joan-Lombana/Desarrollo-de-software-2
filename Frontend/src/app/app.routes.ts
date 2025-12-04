import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { PrincipalComponent } from './pages/principal/principal';
import { RutasComponent } from './components/rutas/rutas';
import { AuthCallback } from './components/authcallback/authcallback';

export const routes: Routes = [
  {
    path: "",
    component: InicioComponent,
  },
  {
    path: "principal",
    component: PrincipalComponent,
  },
  {
    path: "rutas",
    component: RutasComponent,
  },
  {
    path: "auth/callback",   //NECESARIO
    component: AuthCallback
  },
];

