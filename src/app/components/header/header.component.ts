import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../layout/layout.service';
import { TokenService } from 'src/app/pages/auth/token.service';
// import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  items!: MenuItem[];

  nombreUsuario: string = '';
  tipoUsuario: string = '';
  rolesUsuario: string = '';
  emailUsuario: string = '';
  permisosUsuario: string = '';

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = this.tokenService.getNombreUsuario();
    this.tipoUsuario = this.tokenService.getTipoUsuario();
    this.rolesUsuario = this.tokenService.getRolesUsuario();
    this.emailUsuario = this.tokenService.getEmailUsuario();
    this.permisosUsuario = this.tokenService.getPermisosUsuario();
  }
}
