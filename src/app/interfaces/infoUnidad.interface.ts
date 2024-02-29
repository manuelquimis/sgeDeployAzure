export interface DataUnidadesParte {
  uuidUnidad: string;
  // agregar más
}

export interface RegistrarUnidadInterface {
  nombreUnidad: string;
  claseUnidad: string;
  tipoUnidad: string;
  uuidVehiculoSeleccionado: string;
}

export interface EliminarUnidadInterface {
  razonEliminacion: string;
}

export interface DataUnidadesInterface {
  claseUnidad: string;
  estacionUnidad: string;
  estadoUnidad: string;
  fechaRegistro: string;
  horaLlegadaEmergencia: string;
  horaLlegadaEstacion: string;
  horaRegistro: string;
  horaSalidaEstacion: string;
  horaTrabajoTerminado: string;
  horaLlegadaCasaMedica: string;
  kmEntrada: string;
  kmSalida: string;
  nombreUnidad: string;
  razonEliminacion: string;
  tipoUnidad: string;
  uuidUnidad: string;
  uuidVehiculoSeleccionado: string;
  // maquinista
  cedulaMaquinista: string;
  nombresMaquinista: string;
  rangoMaquinista: string;
  cargoMaquinista: string;
  idMaquinista: string;
  uuidEmergenciaFk: string;
}
