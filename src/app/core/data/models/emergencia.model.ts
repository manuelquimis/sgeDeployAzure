
export interface EmergenciaActualInterface {
    uuid?: string,
    fecha?: string,
    horaDespacho?: string,
    horaSalidaEstacion?: string,
    tiempoEnSalirDeEstacion?: string,
    horaDeLlegadaEmergencia?: string,
    tiempoEnLlegarEmergencia?: string,
    horaLlegadaHospital?: string,
    horaTrabajoTerminado?: string,
    horaLlegadaEstacion?: string,
    tiempoFueraEstacion?: string,
    kmSalida?: number,
    kmEntrada?: number,
    kmRecorrido?: number,
    operador?: string,
    br?: string,
    estacion?: number,
    codEmergencia?: string,
    emergencia?: string,
    unidad?: string,
    identificadorParte?: number,
    solicitanteRecurso?: string,
    direccion?: string,
    trasladoCasaSalud?: string,
    observacionDelta?: string
}


export interface DataEmergencia {
    uuid?: string,
    br?: string,
    codEmergencia?: string,
    emergencia?: string,
    direccion?: string,
    unidad: [
      {
        uuid?: string,
        code?: string,
        kmEntrada?: string,
        kmSalida?: string
      }
    ]
  }