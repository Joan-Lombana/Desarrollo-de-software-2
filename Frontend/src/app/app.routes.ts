import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { PrincipalComponent } from './pages/principal/principal';
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
    path: "auth/callback",   // 👈 NECESARIO
    component: AuthCallback
  },
];

