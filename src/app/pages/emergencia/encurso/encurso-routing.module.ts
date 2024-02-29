import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { EncursoComponent } from "./encurso.component";


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      { path: '', component: EncursoComponent }
    ])
  ],
  exports: [RouterModule]
})
export class EncursoRoutingModule { }
