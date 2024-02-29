import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetallesComponent } from './detalles.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([{ path: ':uuid', component: DetallesComponent }]),
  ],
  exports: [RouterModule],
})
export class DetallesRoutingModule {}
