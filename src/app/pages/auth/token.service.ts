import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  getNombreUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }
    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const nombresUsuario = valueJson.nombres;
        return nombresUsuario;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getApellidosUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }

    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const apellidoPaternoUsuario = valueJson.apellido_paterno;
        const apellidoMaternoUsuario = valueJson.apellido_materno;

        const apellidosUsuario = `${apellidoPaternoUsuario} ${apellidoMaternoUsuario}`;
        return apellidosUsuario;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getEmailUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }

    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const emailUsuario = valueJson.email;

        return emailUsuario;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getTipoUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }

    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const tipoUsuario = valueJson.tipo_usuario;
        // console.log('tipo usuario: ', tipoUsuario);
        return tipoUsuario;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getRolesUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }

    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const rolesUsuario = valueJson.roles;
        return rolesUsuario[0].nombre;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getPermisosUsuario(): string | any {
    if (!this.isLogged) {
      return null;
    }

    try {
      const token = this.getToken();
      const decodedToken: any = jwtDecode(token);

      if (typeof decodedToken.data === 'string') {
        const value = atob(decodedToken.data);
        const valueJson = JSON.parse(value);
        const permisosUsuario = valueJson.roles;

        // console.log('data', valueJson);

        const nombresPermisos: string[] = [];
        permisosUsuario.forEach((usuario: any) => {
          if (usuario.permisos && Array.isArray(usuario.permisos)) {
            usuario.permisos.forEach((permiso: any) => {
              if (permiso.nombre) {
                nombresPermisos.push(permiso.nombre);
              }
            });
          }
        });

        // console.log('permisos', nombresPermisos);

        return nombresPermisos;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logOut(): void {
    localStorage.clear();
  }
}
