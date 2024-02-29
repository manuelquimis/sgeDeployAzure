import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../auth/token.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
})
export class NotfoundComponent implements OnInit {
  sesionIniciada: boolean = false;

  constructor(
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.sesionIniciada = this.tokenService.isLogged();
  }

  redireccionar() {
    if (this.sesionIniciada) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
