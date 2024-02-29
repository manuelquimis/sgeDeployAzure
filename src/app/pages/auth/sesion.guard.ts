import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class SesionGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.tokenService.isLogged()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
