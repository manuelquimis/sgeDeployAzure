export interface DataRegistroAfectado {
  ciAfectado: string;
  nombresAfectado: string;
  fechaNacimientoAfectado: string;
  telefonoAfectado: string;
  uuidEmergenciaFk: string;
}

export interface DataActualizarAfectado {
  ciAfectado: string;
  nombresAfectado: string;
  fechaNacimientoAfectado: string;
  telefonoAfectado: string;
}

export interface DataAfectadosParte {
  uuidAfectado: string;
  ciAfectado: string;
  nombresAfectado: string;
  fechaNacimientoAfectado: string;
  telefonoAfectado: string;
  uuidEmergenciaFk: string;
  estado: string;
}
