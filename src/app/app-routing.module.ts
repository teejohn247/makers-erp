import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { UserAuthGuard } from './shared/services/utils/user-auth.guard';

const routes: Routes = [
  {
    path: '', 
    pathMatch: 'prefix', 
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'set-password',
    component: LoginComponent
  },
  {
    path: 'forgot-password',
    component: LoginComponent
  },
  {
    path: 'set-password/:token',
    component: LoginComponent
  },
  {
    path: 'app',
    loadChildren: () => import('./modules/features/features.module').then(m => m.FeaturesModule),
    canActivate: [UserAuthGuard]
  },
  // {
  //   path: 'human-resources',
  //   loadChildren: () => import('./modules/features/features.module').then(m => m.FeaturesModule),
  //   canActivate: [UserAuthGuard]
  // },
  {
    path: 'app/:userToken',
    loadChildren: () => import('./modules/features/features.module').then(m => m.FeaturesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
