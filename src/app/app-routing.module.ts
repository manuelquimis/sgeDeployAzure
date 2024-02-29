import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SesionGuard } from './pages/auth/sesion.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: LayoutComponent,
          children: [
            {
              path: 'dashboard',
              loadChildren: () =>
                import('./pages/dashboard/dashboard.module').then(
                  (m) => m.DashboardModule
                ),
              canActivate: [SesionGuard],
            },
            {
              path: 'emergencia',
              loadChildren: () =>
                import('./pages/emergencia/emergencia.module').then(
                  (m) => m.EmergenciaModule
                ),
              canActivate: [SesionGuard],
            },
            {
              path: 'parte',
              loadChildren: () =>
                import('./pages/parte/parte.module').then((m) => m.ParteModule),
              canActivate: [SesionGuard],
            },
            {
              path: 'usuario',
              loadChildren: () =>
                import('./pages/usuario/usuario.module').then(
                  (m) => m.UsuarioModule
                ),
              canActivate: [SesionGuard],
            },
          ],
        },
        {
          path: 'login',
          loadChildren: () =>
            import('./pages/auth/login/login.module').then(
              (m) => m.LoginModule
            ),
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
