import { Component, OnInit, ViewChild } from '@angular/core';
import { ParteService } from '../parte.service';
import Swal from 'sweetalert2';
import {
  DataAfectadosParte,
  DataParte,
  DataUnidadesInterface,
  DataUnidadesParte,
  DataVictimaParte,
} from 'src/app/interfaces';
import { Table } from 'primeng/table';
import { IconoLogoBase64, NombreeBase64 } from '../../../constants';
import pdfMake from 'pdfmake/build/pdfMake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { obtenerFechaHoraActual } from '../../../functions';
import { TokenService } from '../../auth/token.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
})
export class ListarComponent implements OnInit {
  loadingParteCmdte: boolean = false;
  mostrarParteCmdte: boolean = false;
  mostrarIndicadorCarga: boolean = true;

  loading: boolean = true;

  loadingParteRadioOperador: boolean = false;
  mostrarParteRadioOperador: boolean = false;

  partes_emergencias: DataParte[] = [];

  detalles_parte_cmdt?: DataParte = {
    uuidEmergencia: '',
    numeroParte: '',
    nombresRadioOperador: '',
    apellidosRadioOperador: '',
    nominativoRadioOperador: '',
    nombresCmdt: '',
    apellidosCmdt: '',
    nominativoCmdt: '',
    direccion: '',
    barrio: '',
    fechaDespacho: '',
    horaDespacho: '',
    horaLlamada: '',
    formaAviso: '',
    codEmergencia: '',
    desEmergencia: '',
    causaDeEmergencia: '',
    danoMateriales: '',
    unidadesPresente: '',
    personalPresente: '',
    apoyoRequerido: '',
    observacionCmdt: '',
    solicitante: '',
    victimas: [],
    afectados: [],
    unidades: [],
    telefonoSolicitante: '',
    observacionRadioOperador: '',
    nombresCompletoSolicitante: '',
    esConfirmada: '',
    viviendaLocal: '',
    presenciaPolicial: '',
    descripcionP: '',
    descripcionH: '',
    codigoH: '',
    referencia: '',
  };

  detalle_victimas?: DataVictimaParte[] | any = [];
  detalle_afectados?: DataAfectadosParte[] | any = [];
  detalle_unidades?: DataUnidadesParte[] | any = [];
  nombresUnidadesT: any;

  detalle_unidad?: DataUnidadesInterface[] = [];

  rolUsuario: string = '';

  constructor(
    private readonly parteService: ParteService,
    private readonly tokenService: TokenService
  ) {}

  @ViewChild('dt2') dt2!: Table;

  ngOnInit(): void {
    this.rolUsuario = this.tokenService.getRolesUsuario();
    this.obtenerPartesFinalizados();

    // this.createPdf();
  }

  async obtenerPartesFinalizados() {
    try {
      const response = await this.parteService
        .listar_partes_finalizados()
        .toPromise();
      setTimeout(() => {
        this.loading = false;
        this.partes_emergencias = response.data;
        this.mostrarIndicadorCarga = false;
      }, 1000);
    } catch (error) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        text: `Ocurrio un problema`,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        toast: true,
        color: 'text-900',
      });
    }
  }

  abrirParteCmdte(uuidRegistro: string) {
    this.obtenerPartesFinalizados();
    this.mostrarParteCmdte = true;

    this.detalles_parte_cmdt = this.partes_emergencias.find(
      (parteEmergencia) => parteEmergencia.uuidEmergencia === uuidRegistro
    );

    const victimas = this.detalles_parte_cmdt?.victimas.filter(
      (victima: DataVictimaParte) => victima.estado === 'Activo'
    );
    this.detalle_victimas = victimas;

    const afectados = this.detalles_parte_cmdt?.afectados.filter(
      (afectados: DataAfectadosParte) => afectados.estado === 'Activo'
    );
    this.detalle_afectados = afectados;

    const unidades = this.detalles_parte_cmdt?.unidades.filter(
      (unidades: DataUnidadesInterface) => unidades.estadoUnidad === 'En uso'
    );
    this.detalle_unidades = unidades;

    this.unidadD = this.detalle_unidades;

    const nombresUnidades = this.detalles_parte_cmdt?.unidades
      .filter(
        (unidad: DataUnidadesInterface) => unidad.estadoUnidad === 'En uso'
      )
      .map((unidad: DataUnidadesInterface) => unidad.nombreUnidad);

    this.nombresUnidadesT = nombresUnidades;
  }

  unidadD: any;

  abrirParteRadioOperador(uuidRegistro: string) {
    this.obtenerPartesFinalizados();

    this.mostrarParteRadioOperador = true;

    this.detalles_parte_cmdt = this.partes_emergencias.find(
      (parteEmergencia) => parteEmergencia.uuidEmergencia === uuidRegistro
    );

    const victimas = this.detalles_parte_cmdt?.victimas.filter(
      (victima: DataVictimaParte) => victima.estado === 'Activo'
    );
    this.detalle_victimas = victimas;

    const afectados = this.detalles_parte_cmdt?.afectados.filter(
      (afectados: DataAfectadosParte) => afectados.estado === 'Activo'
    );
    this.detalle_afectados = afectados;

    const unidades = this.detalles_parte_cmdt?.unidades.filter(
      (unidades: DataUnidadesInterface) => unidades.estadoUnidad === 'En uso'
    );
    const datos = {} as DataUnidadesInterface;
    this.detalle_unidades = unidades;
  }

  generarReporteGeneral() {
    const currentDate = new Date().toLocaleString();
    const fecha = obtenerFechaHoraActual().fecha;
    const hora = obtenerFechaHoraActual().hora;

    const filasFiltradas = this.dt2.filteredValue || this.dt2.value;

    const tableBody = filasFiltradas.map((fila) => {
      const numeroParte = fila.numeroParte;
      const unidades = fila.unidades || [];

      const unidadesEnUso = unidades.filter(
        (unidad: any) => unidad.estadoUnidad === 'En uso'
      );

      return unidadesEnUso.map((unidad: any) => [
        { text: numeroParte, fontSize: 11 },
        { text: unidad.nombreUnidad || '', fontSize: 11 },
        { text: unidad.horaSalidaEstacion || '', fontSize: 11 },
        { text: unidad.horaLlegadaEmergencia || '', fontSize: 11 },
        { text: unidad.horaLlegadaEstacion || '', fontSize: 11 },
        { text: unidad.nombresMaquinista || '', fontSize: 11 },
      ]);
    });

    const tableBodyAfectado = filasFiltradas.map((fila) => {
      const numeroParte = fila.numeroParte;
      const afectados = fila.afectados || [];

      return afectados.map((afectado: any) => [
        { text: numeroParte, fontSize: 11 },
        { text: afectado.ciAfectado || '', fontSize: 11 },
        { text: afectado.nombresAfectado || '', fontSize: 11 },
      ]);
    });

    const tableBodyVictimas = filasFiltradas.map((fila) => {
      const numeroParte = fila.numeroParte;
      const victimas = fila.victimas || [];

      return victimas.map((victima: any) => [
        { text: numeroParte, fontSize: 11 },
        { text: victima.ciVictima || '', fontSize: 11 },
        { text: victima.nombresVictima || '', fontSize: 11 },
        { text: victima.procedimiento || '', fontSize: 11 },
        { text: victima.casaMedica || '', fontSize: 11 },
      ]);
    });

    const pdfDefinition: any = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 30],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              image: NombreeBase64,
              alignment: 'left',
              width: 60,
              opacity: 0.7,
              margin: [40, -10, 0, 0],
            },
            {},
            {
              text: `Generado: ${currentDate}`,
              alignment: 'center',
              fontSize: 10,
              bold: true,
              opacity: 0.7,
            },
            {
              text: currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
              margin: [0, 0, 40, 0],
              fontSize: 11,
              bold: true,
              opacity: 0.7,
            },
          ],
        };
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 50, 15, 0],
          },
          {
            columns: [
              {
                text: '',
                width: 45,
                height: 50,
                alignment: 'left',
              },
              {
                stack: [
                  {
                    text: 'Benemérito Cuerpo de Bomberos de Manta',
                    fontSize: 14,
                    bold: true,
                  },
                  {
                    text: 'Parte de Emergencias - Detalles Generales',
                    fontSize: 12,
                    bold: true,
                  },
                  {
                    text: 'Manta - Manabí - Ecuador',
                    fontSize: 11,
                    bold: true,
                  },
                ],
                alignment: 'center',
              },
              {
                image: IconoLogoBase64,
                width: 45,
                alignment: 'right',
              },
            ],
            margin: [50, 10, 50, 0],
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 10, 15, 0],
          },
        ];
      },
      background: [
        {
          image: NombreeBase64,
          width: 500,
          height: 400,
          absolutePosition: { x: 50, y: 220 },
          opacity: 0.04,
        },
      ],
      content: [
        {
          text: 'Información Consolidada de Emergencias',
          fontSize: 13,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 0],
        },
        {
          text: `(Reporte a fecha ${fecha} y hora ${hora})`,
          fontSize: 10,
          bold: false,
          alignment: 'center',
          margin: [0, 0, 0, 0],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Datos Generales',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', '*'],
            body: [
              [
                {
                  text: 'Fecha',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'N° Parte',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                { text: 'Tipo', bold: true, alignment: 'center', fontSize: 11 },
                {
                  text: 'Descripción',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Dirección',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...filasFiltradas.map((fila) => [
                { text: fila.fechaDespacho, fontSize: 11 },
                { text: fila.numeroParte, fontSize: 11 },
                { text: fila.descripcionP, fontSize: 11 },
                { text: fila.descripcionH, fontSize: 11 },
                { text: fila.direccion, fontSize: 11 },
              ]),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalles: Personal Bomberil',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', '*'],
            body: [
              [
                {
                  text: 'N° Parte',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Radio Operador',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Jefe Emergencia',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...filasFiltradas.map((fila) => [
                { text: fila.numeroParte, fontSize: 11 },
                { text: fila.nombresRadioOperador, fontSize: 11 },
                { text: fila.nombresCmdt, fontSize: 11 },
              ]),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalles: Unidades de Emergencia',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', 'auto', '*'],
            body: [
              [
                {
                  text: 'N° Parte',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Unidad',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Salida Estación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Llegada a Lugar',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Entrada Estación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Maquinista',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...tableBody.flat(),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalles: Personas Afectadas',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', 'auto', '*'],
            body: [
              [
                {
                  text: 'N° Parte',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...tableBodyAfectado.flat(),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalles: Victimas',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', 'auto', '*', 'auto', '*'],
            body: [
              [
                {
                  text: 'N° Parte',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Procedimiento',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Casa Médica',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...tableBodyVictimas.flat(),
            ],
          },
        },
      ],
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  generarReporteRadioOperador(item: any) {
    const currentDate = new Date().toLocaleString();

    const pdfDefinition: any = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 30],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              image: NombreeBase64,
              alignment: 'left',
              width: 60,
              //   height: 500,
              opacity: 0.7,
              margin: [40, -10, 0, 0],
            },
            {
              // text: 'Bomberos Manta',
              // color: [190, 31, 45], // Color RGB
              // margin: [40, 0, 0, 0], // Texto en la esquina inferior izquierda
              // fontSize: 11,
              // bold: true,
            },
            {
              text: `Generado: ${currentDate}`,
              alignment: 'center',
              fontSize: 10,
              bold: true,
              opacity: 0.7,
            },
            {
              text: currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
              margin: [0, 0, 40, 0],
              fontSize: 11,
              bold: true,
              opacity: 0.7,
            },
          ],
        };
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 50, 15, 0],
          },
          {
            columns: [
              {
                text: '',
                width: 45,
                height: 50,
                alignment: 'left',
              },
              {
                stack: [
                  {
                    text: 'Benemérito Cuerpo de Bomberos de Manta',
                    fontSize: 14,
                    bold: true,
                  },
                  {
                    text: 'Dirección de Prevención de Incendios - B2',
                    fontSize: 12,
                    bold: true,
                  },
                  {
                    text: 'Departamento de Radio Operadores',
                    fontSize: 12,
                    bold: true,
                  },
                  {
                    text: 'Manta - Manabí - Ecuador',
                    fontSize: 11,
                    bold: true,
                  },
                ],
                alignment: 'center',
              },
              {
                image: IconoLogoBase64,
                width: 45,
                alignment: 'right',
              },
            ],
            margin: [50, 10, 50, 0],
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 10, 15, 0],
          },
        ];
      },

      background: [
        {
          image: NombreeBase64,
          width: 500,
          height: 400,
          absolutePosition: { x: 50, y: 220 },
          opacity: 0.04,
        },
      ],
      content: [
        {
          fontSize: 12,
          alignment: 'center',
          columns: [
            {
              columns: [
                {
                  text: 'Número de Parte:',
                  bold: true,
                },
                {
                  text: `${item.numeroParte}`,
                },
              ],
            },
            {
              columns: [
                {
                  text: 'Fecha:',
                  bold: true,
                },
                {
                  text: `${item.fechaDespacho}`,
                },
              ],
            },
          ],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalle Básico ',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Hora de Llamada:',
              bold: true,
            },
            {
              text: `${item.horaLlamada}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Hora de Despacho:',
              bold: true,
            },
            {
              text: `${item.horaDespacho}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Dirección de emergencia:',
              bold: true,
            },
            {
              text: `${item.direccion}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Tipo de Emergencia:',
              bold: true,
            },
            {
              text: `${item.descripcionP} ${item.descripcionH} (${item.codigoH})`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Datos Vivienda o Local:',
              bold: true,
            },
            {
              text: `${item.viviendaLocal}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Es Confirmada:',
              bold: true,
            },
            {
              text: `${item.esConfirmada}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Alertante:',
              bold: true,
            },
            {
              text: '',
            },
          ],
        },
        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Teléfono',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              [
                {
                  text: `${item.ciSolicitante}`,
                },

                {
                  text: `${item.nombresCompletoSolicitante}`,
                },
                {
                  text: `${item.telefonoSolicitante}`,
                },
              ],
            ],
          },
        },

        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Propietario/Representante Legal:',
              bold: true,
            },
            {
              text: '',
            },
          ],
        },
        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Teléfono',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...item.afectados.map((afectado) => [
                { text: afectado.ciAfectado || '', fontSize: 11 },
                { text: afectado.nombresAfectado || '', fontSize: 11 },
                { text: afectado.telefonoAfectado || '', fontSize: 11 },
              ]),
            ],
          },
        },

        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Paciente o Víctimas:',
              bold: true,
            },
            {
              text: '',
            },
          ],
        },
        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Procedimiento',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...item.victimas.map((victima) => [
                { text: victima.ciVictima || '', fontSize: 11 },
                { text: victima.nombresVictima || '', fontSize: 11 },
                { text: victima.procedimiento || '', fontSize: 11 },
              ]),
            ],
          },
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Respuesta de Vehículos',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 10],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                {
                  text: 'Maquinista',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Unidad',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Llegada Emergencia',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Trabajo Terminado',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Llegada Estación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Km Salida',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Km Entrada',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...item.unidades
                .filter((unidad) => unidad.estadoUnidad === 'En uso') // Filtrar unidades en uso
                .map((unidad) => [
                  { text: unidad.nombresMaquinista || '', fontSize: 11 },
                  { text: unidad.nombreUnidad || '', fontSize: 11 },
                  { text: unidad.horaLlegadaEmergencia || '', fontSize: 11 },
                  { text: unidad.horaTrabajoTerminado || '', fontSize: 11 },
                  { text: unidad.horaLlegadaEstacion || '', fontSize: 11 },
                  { text: unidad.kmSalida || '', fontSize: 11 },
                  { text: unidad.kmEntrada || '', fontSize: 11 },
                ]),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Personal Que Acude a la Emergencia',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 10],
        },

        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Comandante de la Emergencia:',
              bold: true,
            },
            {
              text: `${item.nombresCmdt}`,
            },
          ],
        },

        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Novedades:',
              bold: true,
            },
            {
              text: `${item.observacionRadioOperador}`,
            },
          ],
        },

        {
          fontSize: 12,
          margin: [20, 10],
          columns: [
            {
              text: 'Personal de Apoyo:',
              bold: true,
            },
            {
              text: `${item.personalPresente}`,
            },
          ],
        },

        {
          text: 'María Fernanda Merchán Sánchez',
          alignment: 'center',
          margin: [0, 300, 0, 0],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 200,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [175, 5, 15, 5],
        },

        {
          text: 'Responsabilidad',
          bold: true,
          alignment: 'center',
          margin: [50, 0],
        },
      ],
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  generarReporteComandante(item: any) {
    const currentDate = new Date().toLocaleString();

    const pdfDefinition: any = {
      pageOrientation: 'portrait',
      pageSize: 'A4',
      pageMargins: [40, 150, 40, 30],

      footer: function (currentPage, pageCount) {
        return {
          columns: [
            {
              image: NombreeBase64,
              alignment: 'left',
              width: 60,
              opacity: 0.7,
              margin: [40, -10, 0, 0],
            },
            {},
            {
              text: `Generado: ${currentDate}`,
              alignment: 'center',
              fontSize: 10,
              bold: true,
              opacity: 0.7,
            },
            {
              text: currentPage.toString() + ' de ' + pageCount,
              alignment: 'right',
              margin: [0, 0, 40, 0],
              fontSize: 11,
              bold: true,
              opacity: 0.7,
            },
          ],
        };
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 50, 15, 0],
          },
          {
            columns: [
              {
                text: '',
                width: 45,
                height: 50,
                alignment: 'left',
              },
              {
                stack: [
                  {
                    text: 'Benemérito Cuerpo de Bomberos de Manta',
                    fontSize: 14,
                    bold: true,
                  },
                  {
                    text: 'Adnegación y Disciplina - Parte de Emergencias',
                    fontSize: 12,
                    bold: true,
                  },
                  {
                    text: 'Manta - Manabí - Ecuador',
                    fontSize: 11,
                    bold: true,
                  },
                ],
                alignment: 'center',
              },
              {
                image: IconoLogoBase64,
                width: 45,
                alignment: 'right',
              },
            ],
            margin: [50, 10, 50, 0],
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 500,
                y2: 0,
                lineWidth: 2,
                lineColor: [190, 31, 45],
              },
            ],
            margin: [50, 10, 15, 0],
          },
        ];
      },
      background: [
        {
          image: NombreeBase64,
          width: 500,
          height: 400,
          absolutePosition: { x: 50, y: 220 },
          opacity: 0.04,
        },
      ],

      content: [
        {
          fontSize: 12,
          margin: [20, 0, 0, 0],
          columns: [
            {
              columns: [
                {
                  text: 'Número de Parte:',
                  bold: true,
                },
                {
                  text: `${item.numeroParte}`,
                },
              ],
            },
            {
              columns: [
                {
                  text: 'Fecha de Emergencia:',
                  bold: true,
                },
                {
                  text: `${item.fechaDespacho}`,
                },
              ],
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 15, 0, 0],
          columns: [
            {
              columns: [
                {
                  text: 'Tipo de Emergencia:',
                  bold: true,
                },
                {
                  text: `${item.descripcionP} ${item.descripcionH} (${item.codigoH})`,
                },
              ],
            },
            {
              columns: [
                {
                  text: 'Forma de Aviso:',
                  bold: true,
                },
                {
                  text: `${item.formaAviso}`,
                },
              ],
            },
          ],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Detalle Básico ',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          fontSize: 12,
          margin: [20, 15],
          columns: [
            {
              text: 'Dirección de Emergencia:',
              bold: true,
            },
            {
              text: `${item.direccion}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 0],
          columns: [
            {
              text: 'Causas de la Emergencia:',
              bold: true,
            },
            {
              text: `${item.causaDeEmergencia}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 15],
          columns: [
            {
              text: 'Daños Materiales:',
              bold: true,
            },
            {
              text: `${item.danoMateriales}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 0],
          columns: [
            {
              text: 'Unidades Presente:',
              bold: true,
            },
            {
              text: item.unidades
                ? item.unidades.map((unidad) => unidad.nombreUnidad).join(', ')
                : 'No hay unidades presentes',
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 15],
          columns: [
            {
              text: 'Personal Presente:',
              bold: true,
            },
            {
              text: `${item.personalPresente}`,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 0],
          columns: [
            {
              text: 'Apoyo Requerido:',
              bold: true,
            },
            {
              text: `${item.apoyoRequerido}`,
            },
          ],
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          text: 'Personas Afectadas',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Teléfono',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...item.afectados.map((afectado) => [
                { text: afectado.ciAfectado || '', fontSize: 11 },
                { text: afectado.nombresAfectado || '', fontSize: 11 },
                { text: afectado.telefonoAfectado || '', fontSize: 11 },
              ]),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 10, 15, 5],
        },
        {
          text: 'Victimas',
          fontSize: 13,
          bold: true,
          alignment: 'center',
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 5, 15, 0],
        },

        {
          margin: [20, 10],
          table: {
            widths: ['auto', '*', 'auto'],
            body: [
              [
                {
                  text: 'Identificación',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Nombres',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
                {
                  text: 'Procedimiento',
                  bold: true,
                  alignment: 'center',
                  fontSize: 11,
                },
              ],
              ...item.victimas.map((victima) => [
                { text: victima.ciVictima || '', fontSize: 11 },
                { text: victima.nombresVictima || '', fontSize: 11 },
                { text: victima.procedimiento || '', fontSize: 11 },
              ]),
            ],
          },
        },

        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 500,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [15, 23, 15, 5],
        },
        {
          fontSize: 12,
          margin: [20, 5, 0, 0],
          columns: [
            {
              text: 'Novedades:',
              bold: true,
            },
          ],
        },
        {
          fontSize: 12,
          margin: [20, 0],
          columns: [
            {
              text: `${item.observacionCmdt}`,
            },
          ],
        },

        {
          text: `${item.nombresCmdt}`,
          alignment: 'center',
          margin: [0, 30, 0, 0],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 200,
              y2: 0,
              lineWidth: 1,
              lineColor: [190, 31, 45],
            },
          ],
          margin: [175, 5, 15, 5],
        },

        {
          text: 'Comandante de Emergencia',
          bold: true,
          alignment: 'center',
          margin: [50, 0],
        },
      ],
    };

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  descargarRegistrosFiltrados() {
    // Obtener las filas filtradas
    const filasFiltradas = this.dt2.filteredValue || this.dt2.value;

    console.log('ss', filasFiltradas);
  }
}
