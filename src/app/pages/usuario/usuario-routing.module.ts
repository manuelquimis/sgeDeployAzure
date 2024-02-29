import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionGuard } from '../auth/sesion.guard';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then((m) => m.PerfilModule),
        canActivate: [SesionGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
