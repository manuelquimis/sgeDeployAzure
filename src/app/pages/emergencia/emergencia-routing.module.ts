import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SesionGuard } from '../auth/sesion.guard';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: 'despachar',
        loadChildren: () =>
          import('./despachar/despachar.module').then((m) => m.DespacharModule),
        canActivate: [SesionGuard],
      },
      {
        path: 'encurso',
        loadChildren: () =>
          import('./encurso/encurso.module').then((m) => m.EncursoModule),
        canActivate: [SesionGuard],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class EmergenciaRoutingModule {}
