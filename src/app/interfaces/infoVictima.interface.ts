export interface DataVictima {
  ciVictima: string;
  nombresVictima: string;
  fechaNacimientoVictima: string;
  telefonoVictima: string;

  procedimiento: string;
  // procedimiento: OpcionProcedimiento[];

  casaMedica: string;
  horaTraslado: string;
  horaLlegadaCasaMedica: string;
}

export interface OpcionProcedimiento {
  name: string;
  code: string;
}

export interface DataRegistroVictima {
  ciVictima: string;
  nombresVictima: string;
  fechaNacimientoVictima: string;
  telefonoVictima: string;

  procedimiento: string;

  casaMedica: string;
  horaTraslado: string;
  horaLlegadaCasaMedica: string;
}

export interface DataActualizarVictima {
  ciVictima: string;
  nombresVictima: string;
  fechaNacimientoVictima: string;
  telefonoVictima: string;

  procedimiento: string;

  traslado: boolean;
  casaMedica: string;
  horaTraslado: string;
  horaLlegadaCasaMedica: string;
}

export interface DataVictimaParte {
  uuidVictima: string;
  ciVictima: string;
  nombresVictima: string;
  fechaNacimientoVictima: string;
  telefonoVictima: string;
  estado: string;
  procedimiento: OpcionProcedimiento[];

  casaMedica: string;
  horaTraslado: string;
  horaLlegadaCasaMedica: string;
}
