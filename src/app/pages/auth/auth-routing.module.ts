import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild([
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
