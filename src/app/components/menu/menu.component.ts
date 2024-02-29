import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { PrimeIcons } from 'primeng/api';
import { TokenService } from 'src/app/pages/auth/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: any[] = [];

  constructor(
    public layoutService: LayoutService,
    private readonly tokenService: TokenService
  ) {}

  nombreRol: string = '';
  ngOnInit() {
    this.nombreRol = this.tokenService.getRolesUsuario();
    this.buildMenu();
  }

  buildMenu(): void {
    this.model = [
      {
        label: 'Home',
        visible: this.nombreRol === 'DELTA' || this.nombreRol === 'CONSULTA',

        items: [
          {
            label: 'Dashboard',
            icon: PrimeIcons.CHART_BAR,
            routerLink: ['/dashboard'],
          },
        ],
      },
      {
        label: 'Emergencias',
        visible: this.nombreRol === 'DELTA' || this.nombreRol === 'CONSULTA',
        items: [
          {
            label: 'Despachar',
            icon: PrimeIcons.MEGAPHONE,
            routerLink: ['/emergencia/despachar'],
            visible: this.nombreRol === 'DELTA',
          },
          {
            label: 'En Curso',
            icon: 'fa-regular fa-clipboard',
            routerLink: ['/emergencia/encurso'],
            visible:
              this.nombreRol === 'DELTA' || this.nombreRol === 'CONSULTA',
          },
        ],
      },
      {
        label: 'Partes de emergencias',
        items: [
          {
            label: 'Documentar',
            icon: PrimeIcons.FILE_EDIT,
            routerLink: ['/parte/completar'],
            visible: this.nombreRol === 'JEFE_OPERACIONES',
          },
          {
            label: 'Buscar',
            icon: PrimeIcons.SEARCH,
            routerLink: ['/parte/buscar'],
            visible:
              this.nombreRol === 'JEFE_OPERACIONES' ||
              this.nombreRol === 'DELTA' ||
              this.nombreRol === 'CONSULTA',
          },
        ],
      },
      {
        label: '',
        items: [
          {
            label: 'Cerrar Sesión',
            icon: PrimeIcons.SIGN_OUT,
            routerLink: ['/login'],
            command: () => this.tokenService.logOut(),
          },
        ],
      },
    ];
  }
}
