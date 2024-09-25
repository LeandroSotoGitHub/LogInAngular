import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginGuard } from './core/guards/login.guard';


const routes: Routes = [
  {
    path: "", 
    loadChildren: () => import('../app/features/home/home.module').then (m => m.HomeModule),
    canActivate: [loginGuard]
  },
  {
    path: "login", 
    loadChildren: () => import('../app/features/login/login-routing.module').then (m => m.LoginRoutingModule)
  },
  { path: "register", 
    loadChildren: () => import('../app/features/register/register.module').then( m => m.RegisterModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
