import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { enviroment } from '../../../../environments/enviroment';
import { DataRegistroEmergencia } from 'src/app/interfaces/infoEmergencia.interface';

@Injectable({
  providedIn: 'root',
})
export class DespacharService {
  cargar_codigos_json_url = enviroment.CARGAR_CODIGOS_JSON_URL;
  registrar_url = enviroment.REGISTRAR_URL;
  obtener_emergencias_encurso_url = enviroment.OBTENER_EMERGENCIAS_ENCURSO_URL;


  constructor(private readonly httpClient: HttpClient) {}


  cargarCodigosJson():Observable<any>{
    return this.httpClient.get<any>(this.cargar_codigos_json_url)
  }

  obtenerEmergenciasEnCurso(): Observable<any>{
    return this.httpClient.get<any>(this.obtener_emergencias_encurso_url)
  }

  registarEmergencia(dataRegistro: DataRegistroEmergencia): Observable<any> {
    return this.httpClient.post<any>(this.registrar_url, dataRegistro);
  }
  
}
