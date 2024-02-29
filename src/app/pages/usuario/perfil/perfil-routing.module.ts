import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PerfilComponent } from './perfil.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PerfilComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class PerfilRoutingModule {}
