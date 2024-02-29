import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../environments/enviroment';
import { DataActualizarAfectado, DataVictima } from 'src/app/interfaces';
import { DataRegistroAfectado } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ParteService {
  // obtener_emergencias_url = enviroment.OBTENER_EMERGENCIAS_ENCUSO_URL;
  obtener_una_emergencia_url = enviroment.OBTENER_UNA_EMERGENCIA_ENCURSO_URL;

  // completar
  obtener_emergencias_url = enviroment.OBTENER_EMERGENCIAS_URL;
  actualizar_detalle_parte_url = enviroment.ACTUALIZAR_DETALLE_PARTE_URL;
  finalizar_parte_url = enviroment.FINALIZAR_PARTE_URL;

  // detalles
  obtener_detalle_emergencia_url = enviroment.OBTENER_DETALLE_EMERGENCIA_URL;
  registrar_afectado_url = enviroment.REGISTRAR_AFECTADOS_URL;
  actualizar_afectado_url = enviroment.ACTUALIZAR_AFECTADOS_URL;
  eliminar_afectado_url = enviroment.ELIMINAR_AFECTADOS_URL;
  listar_afectado_url = enviroment.LISTAR_AFECTADOS_URL;
  un_afectado_url = enviroment.UN_AFECTADO_URL;

  registrar_victima_url = enviroment.REGISTRAR_VICTIMAS_URL;
  actualizar_victima_url = enviroment.ACTUALIZAR_VICTIMAS_URL;
  eliminar_victima_url = enviroment.ELIMINAR_VICTIMAS_URL;
  listar_victima_url = enviroment.LISTAR_VICTIMAS_URL;
  una_victima_url = enviroment.UNA_VICTIMA_URL;

  // BUSCAR
  listar_partes_finalizados_url = enviroment.LISTAR_PARTES_FINALIZADOS_URL;

  constructor(private readonly httpClient: HttpClient) {}

  // componente documnetar
  obtener_emergencias(): Observable<any> {
    return this.httpClient.get<any>(this.obtener_emergencias_url);
  }

  obtener_emergencias_encurso(): Observable<any> {
    return this.httpClient.get<any>(this.obtener_emergencias_url);
  }

  // componente detalle
  obtener_detalle_emergencia(uuidEmergencia: string): Observable<any> {
    return this.httpClient.get<any>(
      this.obtener_detalle_emergencia_url + uuidEmergencia
    );
  }

  actualizar_detalle_parte(uuidRegistro: string, data: any): Observable<any> {
    return this.httpClient.patch<any>(
      this.actualizar_detalle_parte_url + uuidRegistro,
      data
    );
  }

  finalizar_parte(uuiRegistro: string, data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.finalizar_parte_url + uuiRegistro,
      data
    );
  }

  // componente listar
  registrar_afectado(
    uuidRegistro: string,
    data: DataRegistroAfectado
  ): Observable<any> {
    return this.httpClient.post<any>(
      this.registrar_afectado_url + uuidRegistro,
      data
    );
  }

  listar_afectados(uuidEmergencia: string): Observable<any> {
    return this.httpClient.get<any>(this.listar_afectado_url + uuidEmergencia);
  }

  un_afectado(uuidRegistro: string): Observable<any> {
    return this.httpClient.get<any>(this.un_afectado_url + uuidRegistro);
  }

  actualizar_afectado(
    uuidRegistro: string,
    dataAfectado: DataActualizarAfectado
  ): Observable<any> {
    return this.httpClient.patch<any>(
      this.actualizar_afectado_url + uuidRegistro,
      dataAfectado
    );
  }

  eliminar_afectado(uuidRegistro: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.eliminar_afectado_url + uuidRegistro
    );
  }

  // victimas
  registrar_victima(uuidRegistro: string, data: DataVictima): Observable<any> {
    return this.httpClient.post<any>(
      this.registrar_victima_url + uuidRegistro,
      data
    );
  }

  listar_victima(uuidEmergencia: string): Observable<any> {
    return this.httpClient.get<any>(this.listar_victima_url + uuidEmergencia);
  }

  un_victima(uuidRegistro: string): Observable<any> {
    return this.httpClient.get<any>(this.una_victima_url + uuidRegistro);
  }

  actualizar_victima(uuidRegistro: string, data: DataVictima): Observable<any> {
    return this.httpClient.patch<any>(
      this.actualizar_victima_url + uuidRegistro,
      data
    );
  }

  eliminar_victima(uuidRegistro: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.eliminar_victima_url + uuidRegistro
    );
  }

  // BUSCAR
  listar_partes_finalizados(): Observable<any> {
    return this.httpClient.get<any>(this.listar_partes_finalizados_url);
  }

  validar;
}
