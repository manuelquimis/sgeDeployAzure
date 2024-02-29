import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../auth/token.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  mostrarIndicadorCarga: boolean = true;

  nombresUsuario: string = '';
  apellidosUsuario: string = '';
  emailUsuario: string = '';
  tipoUsuario: string = '';
  rolSistema: string = '';
  permisosUsuario: string = '';

  constructor(private readonly tokenService: TokenService) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  async obtenerDatosUsuario() {
    try {
      this.nombresUsuario = await this.tokenService.getNombreUsuario();
      this.apellidosUsuario = await this.tokenService.getApellidosUsuario();
      this.emailUsuario = await this.tokenService.getEmailUsuario();
      this.tipoUsuario = await this.tokenService.getTipoUsuario();
      this.rolSistema = await this.tokenService.getRolesUsuario();
      this.permisosUsuario = await this.tokenService.getPermisosUsuario();
      setTimeout(() => {
        this.mostrarIndicadorCarga = false;
      }, 1000);
    } catch (error) {
      console.log(error);
      this.mostrarIndicadorCarga = true;

    }
  }
}
