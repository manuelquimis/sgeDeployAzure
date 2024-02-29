export interface DataRegistroEmergencia {
  direccion: string;
  tipoEmergencia: string;
  codigoP: string;
  descripcionP: string;
  nivelP: string;
  codigoH: string;
  descripcionH: string;
  nivelH: string;
  longitud: number;
  latitud: number;
  referencia: string;
  nombresRadioOperador: string;
}

export interface DataRowEmergencia {
  uuidEmergencia: string;
  direccion: string;
  barrio: string;
  codEmergencia: string;
  desEmergencia: string;
}

export interface DataComplementariaEmergencia {
  // uuidEmergencia: string;
  ciSolicitante: string;
  telefonoSolicitante: string;
  nombresCompletoSolicitante: string;
  // ecu911: boolean;
  observacionRadioOperador: string;

  estadoEmergencia: string;

  viviendaLocal: string;
  presenciaPolicial: string;
  esConfirmada: string;
  horaLlamada: string;
}

export interface DataTotalEmergencia {
  numeroParte: string;
}

export interface DataParte {
  uuidEmergencia: string;
  numeroParte: string;
  // radio operador
  nombresRadioOperador: string;
  apellidosRadioOperador: string;
  nominativoRadioOperador: string;
  // cmdt
  nombresCmdt: string;
  apellidosCmdt: string;
  nominativoCmdt: string;
  // datos generales
  direccion: string;
  barrio: string;
  fechaDespacho: string;
  horaDespacho: string;
  horaLlamada: string;
  formaAviso: string;
  codEmergencia: string;
  desEmergencia: string;
  // causas de emergencia
  causaDeEmergencia: string;
  // daños materiales
  danoMateriales: string;
  // unidades presentes
  unidadesPresente: string;

  // personal presente
  personalPresente: string;

  // apoyo requerido
  apoyoRequerido: string;

  // novedades
  observacionCmdt: string;

  victimas: [];
  afectados: [];
  unidades: [];

  solicitante: string;
  telefonoSolicitante: string;
  nombresCompletoSolicitante: string;
  observacionRadioOperador: string;

  esConfirmada: string;
  viviendaLocal: string;
  presenciaPolicial: string;

  descripcionP: string;
  codigoH: string;
  descripcionH: string;
  referencia: string;
}
