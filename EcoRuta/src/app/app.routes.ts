import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Principal } from './pages/principal/principal';



export const routes: Routes = [
    {
        path: "",
        component: Inicio
    },

     {
        path: "",
        component: Principal
    }
];
