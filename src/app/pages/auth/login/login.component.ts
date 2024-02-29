import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../components/layout/layout.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { TokenService } from '../token.service';
import { LoginInterface } from '../../../interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loadingLogin: boolean = false;

  loading: boolean = false;
  password!: string;
  value!: string;

  usuario: LoginInterface = {
    email: '',
    password: '',
    remember_token: true,
    sistema: 'delta',
  };

  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {}
  ngOnInit(): void {}

  btn_login() {
    this.loadingLogin = true;
    this.authService.login(this.usuario).subscribe({
      next: (data) => {
        this.tokenService.setToken(data.data);
        const nombreUsuario = this.tokenService.getNombreUsuario();
        const rolUsuario = this.tokenService.getRolesUsuario();
        if (rolUsuario.includes('DELTA')) {
          this.router.navigate(['/emergencia/despachar']);
        } else if (rolUsuario.includes('JEFE_OPERACIONES')) {
          this.router.navigate(['/parte/completar']);
        } else if (rolUsuario.includes('CONSULTA')) {
          this.router.navigate(['/emergencia/encurso']);
        } else {
          this.router.navigate(['/login']);
        }
        setTimeout(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            html: `¡Bienvenido<span style="color: #326fd1"> ${nombreUsuario}</span>!`,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            // toast: true,
          });
        }, 500);
        this.loadingLogin = false;
      },
      error: (err) => {
        this.loadingLogin = false;
        Swal.fire({
          allowOutsideClick: false,
          icon: 'warning',
          text: err.error.message,
        });
      },
    });
  }
}
