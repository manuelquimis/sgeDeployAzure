const  url = {
  production: true,
  // URL_BASE: `https://4r2jcndw-3100.use2.devtunnels.ms`,
  URL_BASE: 'http://localhost:3100', // 
} 
  
export const enviroment = {
  production: true,
  mapboxKey: 'pk.eyJ1IjoiYWxlamFuZHIwIiwiYSI6ImNsamJ4MzNhNjA2cXkzbnNjbDJhbHhqNWUifQ.GaFfAZajqItc3ZpSWvYWYg',
  // LATITUD: -80.72499899345411,
  // LONGITUD: -0.9481691120841247,
  LONGITUD: -80.72499899345411,
  LATITUD: -0.9481691120841247,
  
  LONGITUD_MAP: -80.800163,
  LATITUD_MAP: -1.003638,

  AUTH_URL: 'https://auth.bomberosmanta.gob.ec/api/',

  REGISTRAR_URL: `${url.URL_BASE}/api/v1/radioperadores/registrarEmergencia/`,

  OBTENER_EMERGENCIAS_ENCURSO_URL: `${url.URL_BASE}/api/v1/radioperadores/emergenciasEncurso`,

  // COMPLETAR
  OBTENER_EMERGENCIAS_URL: `${url.URL_BASE}/api/v1/cmdt/obtener-emergencias`,

  OBTENER_DETALLE_EMERGENCIA_URL: `${url.URL_BASE}/api/v1/cmdt/obtener-detalle-emergencia/`,

  ACTUALIZAR_DETALLE_PARTE_URL: `${url.URL_BASE}/api/v1/cmdt/actualizarDetalleParte/`,

  FINALIZAR_PARTE_URL: `${url.URL_BASE}/api/v1/cmdt/finalizarParte/`,

  OBTENER_UNA_EMERGENCIA_ENCURSO_URL: `${url.URL_BASE}/api/v1/radioperadores/emergenciaEncurso/`, //x

  OBTENER_EMERGENCIAS_ATENDIDAS_URL: `${url.URL_BASE}/api/v1/radioperadores/cantidadEmergenciasAtendidas`,

  ACTUALIZAR_EMERGENCIAS_ENCURSO_URL: `${url.URL_BASE}/api/v1/radioperadores/`,

  FINALIZAR_EMERGENCIA_ENCURSO_URL: `${url.URL_BASE}/api/v1/radioperadores/finalizarEmergenciaRO/`,

  // DETALLES

  // actualizar emergencia
  // finalizar emergencia

  REGISTRAR_AFECTADOS_URL: `${url.URL_BASE}/api/v1/cmdt/afectado/`,
  ACTUALIZAR_AFECTADOS_URL: `${url.URL_BASE}/api/v1/cmdt/actualizar-afectado/`,
  ELIMINAR_AFECTADOS_URL: `${url.URL_BASE}/api/v1/cmdt/eliminar-afectado/`,
  LISTAR_AFECTADOS_URL: `${url.URL_BASE}/api/v1/cmdt/lista-afectados/`,
  UN_AFECTADO_URL: `${url.URL_BASE}/api/v1/cmdt/un-afectado/`,

  REGISTRAR_VICTIMAS_URL: `${url.URL_BASE}/api/v1/cmdt/victima/`,
  ACTUALIZAR_VICTIMAS_URL: `${url.URL_BASE}/api/v1/cmdt/actualizar-victima/`,
  ELIMINAR_VICTIMAS_URL: `${url.URL_BASE}/api/v1/cmdt/eliminar-victima/`,
  LISTAR_VICTIMAS_URL: `${url.URL_BASE}/api/v1/cmdt/lista-victimas/`,
  UNA_VICTIMA_URL: `${url.URL_BASE}/api/v1/cmdt/una-victima/`,
  

  // BUSCAR
  LISTAR_PARTES_FINALIZADOS_URL: `${url.URL_BASE}/api/v1/radioperadores/listarPartesFinalizados`,

  // VEHICULO
  OBTENER_VEHICULOS_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculos`,
  ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_ASIGNADO_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculo-estado-asignado/`,
  // ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_FINALIZADA_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculo-estado-finalizado/`,
  ACTUALIZAR_ESTADO_VEHICULO_DESPUES_DE_ELIMINADO_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculo-estado-eliminado/`,
  CANTIDAD_VEHICULOS_MOVILIZADOS_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculo-movilizados`,
  ACTUALIZAR_ESTADO_VEHICULO_LIBRE_URL: `${url.URL_BASE}/api/v1/radioperadores/vehiculo-estado-libre/`,


  // UNIDAD
  ASIGNAR_UNIDAD_URL: `${url.URL_BASE}/api/v1/radioperadores/asignar-unidad/`,
  ELIMINAR_UNIDAD_URL: `${url.URL_BASE}/api/v1/radioperadores/eliminar-unidad/`,
  ACTUALIZAR_UNIDAD_URL:`${url.URL_BASE}/api/v1/radioperadores/actualizar-unidad/`,
  ASIGNAR_MAQUINISTA_URL: `${url.URL_BASE}/api/v1/radioperadores/asignar-maquinista/`,


  // MAQUINISTAS - EMPLEADOS
  OBTENER_EMPLEADOS_URL: `${url.URL_BASE}/api/v1/radioperadores/maquinistas`,
  ACTUALIZAR_ESTADO_EMPLEADOS_ASIGNADOS_URL: `${url.URL_BASE}/api/v1/radioperadores/maquinista-estado-asignado/`,
  ACTUALIZAR_ESTADO_EMPLEADO_DISPONIBLE_URL: `${url.URL_BASE}/api/v1/radioperadores/maquinista-estado-disponible/`,

  // DESPACHAR
  CARGAR_CODIGOS_JSON_URL: 'assets/codigos.json',
  // CARGAR_CODIGOS_JSON_URL: 'http://localhost:4200/src/app/pages/emergencia/despachar/codigos.json',


  // DASHBOARD

  CARGAR_DATOS_HEAD_MAP_URL:  `${url.URL_BASE}/api/v1/radioperadores/heatmap`,
  REPORTE_DIARIO_URL: `${url.URL_BASE}/api/v1/radioperadores/reporte-diario`,
  REPORTE_SEMANAL_URL: `${url.URL_BASE}/api/v1/radioperadores/reporte-semanal`,
  REPORTE_MENSUAL_URL: `${url.URL_BASE}/api/v1/radioperadores/reporte-mensual-uno`,
};
