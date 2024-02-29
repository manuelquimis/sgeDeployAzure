import { ReporteSemanalInterface } from './../../interfaces/infoDashboard.interface';
import { Injectable } from '@angular/core';
import { enviroment } from '../../../environments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteDiarioInterface } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  cargar_datos_head_map_url = enviroment.CARGAR_DATOS_HEAD_MAP_URL;
  reporte_diario_url = enviroment.REPORTE_DIARIO_URL;
  reporte_semanal_url = enviroment.REPORTE_SEMANAL_URL;
  reporte_mensual_url = enviroment.REPORTE_MENSUAL_URL;

  constructor(private readonly httpClient: HttpClient) {}

  obtenerDatosHeatMap(): Observable<any> {
    return this.httpClient.get<any>(this.cargar_datos_head_map_url);
  }

  obtenerReporteDiario(fechaDespacho: ReporteDiarioInterface):Observable<any>{
    return this.httpClient.post<any>(this.reporte_diario_url, fechaDespacho)
  }

  
  obtenerReporteSemanal(rangos: ReporteSemanalInterface):Observable<any>{
    return this.httpClient.post<any>(this.reporte_semanal_url, rangos)
  }

  
  obtenerReporteMensual(fechaDespacho: ReporteDiarioInterface):Observable<any>{
    return this.httpClient.post<any>(this.reporte_mensual_url, fechaDespacho)
  }
}
