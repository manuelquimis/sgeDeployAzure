import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DespacharComponent } from './despachar.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DespacharComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class DespacharRoutingModule {}
