import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "../../../../environments/enviroment";
import { DataComplementariaEmergencia, DataRowEmergencia, DataUnidadesInterface, EliminarUnidadInterface, RegistrarUnidadInterface, VehiculoInterface } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EncursoService {
  obtener_emergencias_encurso_url = enviroment.OBTENER_EMERGENCIAS_ENCURSO_URL;
  cantidad_emergencias_atendidas_url = enviroment.OBTENER_EMERGENCIAS_ATENDIDAS_URL;
  actualizar_emergencia_encurso_url = enviroment.ACTUALIZAR_EMERGENCIAS_ENCURSO_URL;
  obtener_una_emergencia_encurso_url = enviroment.OBTENER_UNA_EMERGENCIA_ENCURSO_URL; 
  finalizar_emergencia_encurso_url = enviroment.FINALIZAR_EMERGENCIA_ENCURSO_URL;
  obtener_vehiculos_url = enviroment.OBTENER_VEHICULOS_URL;
  asignar_unidad_url = enviroment.ASIGNAR_UNIDAD_URL;
  eliminar_unidad_url = enviroment.ELIMINAR_UNIDAD_URL;
  actualizar_estado_vehiculo_despues_de_asignado_url = enviroment.ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_ASIGNADO_URL;
  // actualizar_estado_vehiculo_despues_de_finalizado_url = enviroment.ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_FINALIZADA_URL;
  actualizar_estado_vehiculo_despues_de_eliminado_url = enviroment.ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_ELIMINADO_URL;
  actualizar_estado_vehiculo_libre_url = enviroment.ACTUALIZAR_ESTADO_VEHICULO_LIBRE_URL;
  cantidad_vehiculos_movilizados_url = enviroment.CANTIDAD_VEHICULOS_MOVILIZADOS_URL;
  actualizar_unidad_url = enviroment.ACTUALIZAR_UNIDAD_URL;
  asignar_maquinista_url = enviroment.ASIGNAR_MAQUINISTA_URL;
  obtener_empleados_url = enviroment.OBTENER_EMPLEADOS_URL;
  actualizar_estado_empleados_asignados_url = enviroment.ACTUALIZAR_ESTADO_EMPLEADOS_ASIGNADOS_URL;
  actualizar_estado_empleado_disponible_url = enviroment.ACTUALIZAR_ESTADO_EMPLEADO_DISPONIBLE_URL;


  constructor(private readonly httpClient: HttpClient) {}

  obtenerCantidadEmergenciasAtendidas():Observable<any> {
    return this.httpClient.get<any>(this.cantidad_emergencias_atendidas_url)
  }

  obtenerEmergenciasEnCurso(): Observable<any>{
    return this.httpClient.get<any>(this.obtener_emergencias_encurso_url)
  }

  obtenerUnaEmergenciaEnCurso(uuidEmergencia: string): Observable<any>{
    return this.httpClient.get<any>(this.obtener_una_emergencia_encurso_url + uuidEmergencia)
  }

  actualizar_emergencia_encurso(uuidEmergencia: string, {...emergencia}:DataRowEmergencia){
    return this.httpClient.patch<any>(this.actualizar_emergencia_encurso_url + `actualizarEmergencia/${uuidEmergencia}`, emergencia)
  }

  agregar_datos_complementarios(uuidEmergencia: string, {...emergencia}: DataComplementariaEmergencia){
    return this.httpClient.patch<any>(this.actualizar_emergencia_encurso_url + `actualizarEmergencia/${uuidEmergencia}`, emergencia)

  }

  finalizar_emergencia_encurso(uuidEmergencia: string): Observable<any>{
    return this.httpClient.post<any>(this.finalizar_emergencia_encurso_url + uuidEmergencia, '')
  }

  // vehiculos
  obtenerVehiculos(): Observable<any>{
    return this.httpClient.get<any>(this.obtener_vehiculos_url)
  }
  actualizarEstadoVehiculoAsignado(uuidRegistro: string):Observable<any>{
    return this.httpClient.post<any>(this.actualizar_estado_vehiculo_despues_de_asignado_url + uuidRegistro, '')
  }
  actualizarEstadoVehiculoEliminado(uuidRegistro: string):Observable<any>{
    return this.httpClient.post<any>(this.actualizar_estado_vehiculo_despues_de_eliminado_url + uuidRegistro, '')
  }
  actualizarEstadoVehiculoLibre(uuidRegistro: string):Observable<any>{
    return this.httpClient.post<any>(this.actualizar_estado_vehiculo_libre_url + uuidRegistro, '')
  }

  cantidadVehiculosMovilizados():Observable<any>{
    return this.httpClient.get<any>(this.cantidad_vehiculos_movilizados_url)
  }

  // unidades
  asignarUnidad(uuidRegistro: string, registro: any):Observable<any>{
    return this.httpClient.post<any>(this.asignar_unidad_url + uuidRegistro, registro)
  }

  eliminarUnidad(uuidRegistro: string, registro: EliminarUnidadInterface):Observable<any>{
    return this.httpClient.post<any>(this.eliminar_unidad_url + uuidRegistro, registro)
  }

  actualizarUnidad(uuidRegistro: string, datos: DataUnidadesInterface){
    return this.httpClient.patch<any>(this.actualizar_unidad_url + uuidRegistro, datos)
  }

  asignarMaquista(uuidRegistro: string, registro: any):Observable<any>{
    return this.httpClient.patch<any>(this.asignar_maquinista_url + uuidRegistro, registro)
  }

  // empleados - maquinistas
  obtenerMaquinistas():Observable<any>{
    return this.httpClient.get<any>(this.obtener_empleados_url)
  }
  actualizarEstadoEmpleadosAsignados(uuidRegistro: string):Observable<any>{
    return this.httpClient.post<any>(this.actualizar_estado_empleados_asignados_url + uuidRegistro, '')
  }
  actualizarEstadoEmpleadosDisponible(uuidRegistro: string):Observable<any>{
    return this.httpClient.post<any>(this.actualizar_estado_empleado_disponible_url + uuidRegistro, '')
  }

}
