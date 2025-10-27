import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { PrincipalComponent } from './pages/principal/principal';




export const routes: Routes = [
    {
        path: "",
        component: InicioComponent,
      
    },

     {
        path: "principal",
        component: PrincipalComponent,
    }
];
