import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { PrincipalComponent } from './pages/principal/principal';
import { LoginComponent } from './pages/inicio/login/login';



export const routes: Routes = [
    {
        path: "",
        component: InicioComponent,
        children: [
            {
                path: '',
                component: LoginComponent
            }
        ]
    },

     {
        path: "principal",
        component: PrincipalComponent,
    }
];
