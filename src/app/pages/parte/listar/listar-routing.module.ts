import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListarComponent } from './listar.component';

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild([{ path: '', component: ListarComponent }])],
  exports: [RouterModule],
})
export class ListarRoutingModule {}
