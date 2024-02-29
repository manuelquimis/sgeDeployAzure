export interface CodigosInterface {
  uuidCodigo: string;
  id: string;
  codigoPadre: string;
  codigo: string;
  nivel: string;
}

export interface CodigosJsonInterface {
  codigoPadre: string;
  descripcion: string;
  hijos: [];
  nivel: string
}

export interface CodigoHijoInterface {
  codigo: string;
  descripcion: string;
  nivel: string;
}
