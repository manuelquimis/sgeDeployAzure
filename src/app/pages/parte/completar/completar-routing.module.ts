import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompletarComponent } from './completar.component';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([{ path: '', component: CompletarComponent }]),
  ],
  exports: [RouterModule],
})
export class CompletarRoutingModule {}
