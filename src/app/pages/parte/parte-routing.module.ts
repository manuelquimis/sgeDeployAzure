import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionGuard } from '../auth/sesion.guard';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: 'buscar',
        loadChildren: () =>
          import('./listar/listar.module').then((m) => m.ListarModule),
        canActivate: [SesionGuard],
      },
      {
        path: 'completar',
        loadChildren: () =>
          import('./completar/completar.module').then((m) => m.CompletarModule),
        canActivate: [SesionGuard],
      },
      {
        path: 'completar/detalles',
        loadChildren: () =>
          import('./detalles/detalles.module').then((m) => m.DetallesModule),
        canActivate: [SesionGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ParteRoutingModule {}
