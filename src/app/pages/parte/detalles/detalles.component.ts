import {
  DataActualizarVictima,
  OpcionProcedimiento,
} from './../../../interfaces/infoVictima.interface';
import { ParteService } from './../parte.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import Swal from 'sweetalert2';
import {
  DataActualizarAfectado,
  DataParte,
  DataRegistroAfectado,
  DataVictima,
} from '../../../interfaces';
import { TokenService } from '../../auth/token.service';
import { obtenerFechaHoraActual } from 'src/app/functions';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
})
export class DetallesComponent implements OnInit {
  uuidParams: any;
  dataEnCurso: any;
  loading: boolean = true;
  mostrarIndicadorCarga: boolean = true;

  detalleEmergencia: DataParte = {
    numeroParte: '',
    direccion: '',
    barrio: '',
    codEmergencia: '',
    desEmergencia: '',
    fechaDespacho: '',
    horaDespacho: '',
    formaAviso: '',
    causaDeEmergencia: '',
    danoMateriales: '',
    unidadesPresente: '',
    personalPresente: '',
    apoyoRequerido: '',
    observacionCmdt: '',
    nombresRadioOperador: '',
    apellidosRadioOperador: '',
    nominativoRadioOperador: '',
    nombresCmdt: '',
    apellidosCmdt: '',
    nominativoCmdt: '',
    uuidEmergencia: '',
    victimas: [],
    afectados: [],
    solicitante: '',
    telefonoSolicitante: '',
    observacionRadioOperador: '',
    nombresCompletoSolicitante: '',
    esConfirmada: '',
    viviendaLocal: '',
    presenciaPolicial: '',
    unidades: [],
    descripcionP: '',
    descripcionH: '',
    codigoH: '',
    horaLlamada: '',
    referencia: '',
  };

  tipoDeIdentificacion: any;
  selectTraslado: any;

  // Finalizar parte
  loadingFinalizarParte: boolean = false;

  // Guardar y volver parte
  loadingGuardarVolverParte: boolean = false;

  // Agregar victima
  loadingAgregarVictima: boolean = false;

  // Registar victima
  loadingRegistrarVictimas: boolean = false;
  loadingActualizarVictimas: boolean = false;
  loadingEliminarVictimas: boolean = false;
  formNuevaVictima: boolean = false;
  formActualizarVictima: boolean = false;

  loadingVolver: boolean = false;

  loading_agregar_afectado: boolean = false;
  loading_guardar_afectado: boolean = false;
  loading_actualizar_afectado: boolean = false;
  loading_eliminar_afectado: boolean = false;
  form_nuevo_afectado: boolean = false;
  form_actualizar_afectado: boolean = false;

  loading_abrir_form_victimas: boolean = false;
  loading_actualizar_data_victima: boolean = false;
  // afectados
  data_afectados: DataActualizarAfectado[] = [];
  data_nuevo_afectado: DataRegistroAfectado = {
    ciAfectado: '',
    nombresAfectado: '',
    fechaNacimientoAfectado: '',
    telefonoAfectado: '',
    uuidEmergenciaFk: '',
  };
  data_afectado_update: DataActualizarAfectado = {
    ciAfectado: '',
    nombresAfectado: '',
    fechaNacimientoAfectado: '',
    telefonoAfectado: '',
  };

  data_victimas: DataVictima[] = [];
  data_victima: DataVictima = {
    ciVictima: '',
    nombresVictima: '',
    fechaNacimientoVictima: '',
    telefonoVictima: '',
    casaMedica: '',
    horaTraslado: '',
    horaLlegadaCasaMedica: '',
    procedimiento: '',
  };
  data_victima_update: DataVictima = {
    ciVictima: '',
    nombresVictima: '',
    fechaNacimientoVictima: '',
    telefonoVictima: '',
    procedimiento: '',
    casaMedica: '',
    horaTraslado: '',
    horaLlegadaCasaMedica: '',
  };

  procedimientoOpciones!: OpcionProcedimiento[];
  procedimientoSeleccionado: string[] = [];

  checked: boolean = false;

  nombresComandante: string = '';

  constructor(
    private readonly parteService: ParteService,
    private readonly activetedRouter: ActivatedRoute,
    private readonly router: Router,
    private readonly tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.activetedRouter.paramMap.subscribe((params) => {
      this.uuidParams = params.get('uuid');
    });

    this.validarCampos();

    this.obtener_lista_afectados();
    this.obtener_lista_victimas();
    this.obtener_detalles_emergencia();

    const nombres = this.tokenService.getNombreUsuario();
    const apellidos = this.tokenService.getApellidosUsuario();
    this.nombresComandante = `${nombres} ${apellidos}`;
  }

  obtener_lista_afectados() {
    this.parteService.listar_afectados(this.uuidParams).subscribe({
      next: (data) => {
        this.data_afectados = data.data[0].afectados;
      },
    });
  }

  async obtener_lista_victimas() {
    try {
      const response = await this.parteService
        .listar_victima(this.uuidParams)
        .toPromise();
      if (response) {
        this.data_victimas = response.data[0].victimas;
      }
    } catch (error) {
      console.log(error);
    }
  }
  nombresUnidades: string = '';
  async obtener_detalles_emergencia() {
    try {
      const response = await this.parteService
        .obtener_detalle_emergencia(this.uuidParams)
        .toPromise();
      if (response) {
        setTimeout(() => {
          this.detalleEmergencia = response.data;
          // console.log('detalle: ', this.detalleEmergencia);
          this.nombresUnidades = this.detalleEmergencia.unidades
            .map((unidad: any) => unidad.nombreUnidad)
            .join(', ');
          this.mostrarIndicadorCarga = false;
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // PARTE
  async btnFinalizarParte(detalleEmergencia: any) {
    this.loadingFinalizarParte = true;
    Swal.fire({
      text: 'Al finalizar ya no podrá agregar datos al Parte de la emergencia',
      showCancelButton: true,
      confirmButtonColor: '#16A34A',
      cancelButtonColor: 'info',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          formaAviso: this.detalleEmergencia.formaAviso,
          causaDeEmergencia: this.detalleEmergencia.causaDeEmergencia,
          danoMateriales: this.detalleEmergencia.danoMateriales,
          personalPresente: this.detalleEmergencia.personalPresente,
          apoyoRequerido: this.detalleEmergencia.apoyoRequerido,
          observacionCmdt: this.detalleEmergencia.observacionCmdt,
          nombresCmdt: this.nombresComandante,
        } as DataParte;
        this.parteService.finalizar_parte(this.uuidParams, data).subscribe({
          next: (response) => {
            console.log('recibidao: ', response.data);

            Swal.fire({
              position: 'center',
              icon: 'success',
              text: `${response.message}`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
            });

            this.loadingFinalizarParte = false;
            setTimeout(() => {
              this.router.navigate(['/parte/completar']);
            }, 1000);
          },
          error: (e) => {
            console.log('finalizar error:', e);

            this.loadingFinalizarParte = false;
            Swal.fire({
              position: 'bottom-end',
              icon: 'error',
              text: `Ocurrio un error, intentelo de nuevo`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
              toast: true,
            });
          },
        });
      } else {
        this.loadingFinalizarParte = false;
      }
    });
  }

  mostarBtnGuardar: boolean = true;
  mostrarBtnFinalizar: boolean = false;
  validarCampos() {
    if (
      !this.detalleEmergencia.formaAviso ||
      !this.detalleEmergencia.causaDeEmergencia ||
      !this.detalleEmergencia.observacionCmdt ||
      !this.detalleEmergencia.personalPresente ||
      !this.detalleEmergencia.danoMateriales ||
      !this.detalleEmergencia.apoyoRequerido
    ) {
      this.mostarBtnGuardar = true;
      this.mostrarBtnFinalizar = false;
    } else {
      this.mostarBtnGuardar = false;
      this.mostrarBtnFinalizar = true;
    }
  }

  btnGuardarVolverParte() {
    this.loadingGuardarVolverParte = true;
    const data = {
      formaAviso: this.detalleEmergencia.formaAviso,
      causaDeEmergencia: this.detalleEmergencia.causaDeEmergencia,
      danoMateriales: this.detalleEmergencia.danoMateriales,
      personalPresente: this.detalleEmergencia.personalPresente,
      apoyoRequerido: this.detalleEmergencia.apoyoRequerido,
      observacionCmdt: this.detalleEmergencia.observacionCmdt,
      nombresCmdt: this.nombresComandante,
    } as DataParte;

    this.parteService
      .actualizar_detalle_parte(this.uuidParams, data)
      .subscribe({
        next: (response) => {
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            text: `${response.message}`,
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            toast: true,
          });
          setTimeout(() => {
            this.loadingGuardarVolverParte = false;
          }, 1000);
        },
        error: (e) => {
          console.log('error guardar; ', e);

          Swal.fire({
            icon: 'error',
            text: `Ha ocurrido un error, intente de nuevo.`,
            showCancelButton: true,
            confirmButtonColor: 'secondary',
            cancelButtonColor: 'info',
            confirmButtonText: 'Intentar de nuevo',
            cancelButtonText: 'Cancelar',
            color: 'text-900',
            customClass: {
              popup: 'background-color: #ea0505',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingGuardarVolverParte = false;
            } else {
              this.loadingGuardarVolverParte = false;

              this.parteService
                .obtener_detalle_emergencia(this.uuidParams)
                .subscribe({
                  next: (response) => {
                    this.detalleEmergencia = response.data;
                    Swal.fire({
                      position: 'bottom-end',
                      icon: 'success',
                      text: `Sin cambios registrados`,
                      showConfirmButton: false,
                      timer: 2500,
                      timerProgressBar: true,
                      toast: true,
                      color: 'text-900',
                      customClass: {
                        popup: 'background-color: #ea0505',
                      },
                    });
                    console.log(response.data);
                  },
                });
            }
          });
        },
      });
    console.log('datos para actualizar: ', data);
  }

  btnVolver() {
    this.loadingVolver = true;
    setTimeout(() => {
      this.router.navigate(['/parte/completar']);
    }, 1000);
  }

  // VICTIMAS
  btnAgregarVictima() {
    this.loadingAgregarVictima = true;
    setTimeout(() => {
      this.loadingAgregarVictima = false;
      this.formNuevaVictima = true;
    }, 1000);
  }

  async btnRegistrarVictima() {
    this.loadingRegistrarVictimas = true;

    const dataV = {
      ciVictima: this.data_victima.ciVictima,
      nombresVictima: this.data_victima.nombresVictima,
      fechaNacimientoVictima: this.data_victima.fechaNacimientoVictima,
      telefonoVictima: this.data_victima.telefonoVictima,
      casaMedica: this.data_victima.casaMedica,
      procedimiento: this.data_victima.procedimiento,
      horaTraslado: this.data_victima.horaTraslado,
      horaLlegadaCasaMedica: this.data_victima.horaLlegadaCasaMedica,
    } as unknown as DataVictima;

    if (!this.data_victima.nombresVictima || !this.data_victima.procedimiento) {
      this.mensajeCampoRequeridoVictima = true;
      this.loadingRegistrarVictimas = false;
      return;
    }

    if (
      this.data_victima.fechaNacimientoVictima > obtenerFechaHoraActual().fecha
    ) {
      this.mensajeFechaInvalida = true;
      this.loadingRegistrarVictimas = false;
      return;
    }

    console.log('env. victima: ', dataV);

    this.parteService.registrar_victima(this.uuidParams, dataV).subscribe({
      next: async (response) => {
        this.formNuevaVictima = false;
        this.loadingRegistrarVictimas = true;
        await this.obtener_lista_victimas();
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: `${response.message}`,
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
        });
        (this.data_victima.ciVictima = ''),
          (this.data_victima.nombresVictima = ''),
          (this.data_victima.fechaNacimientoVictima = ''),
          (this.data_victima.telefonoVictima = ''),
          (this.data_victima.casaMedica = ''),
          (this.data_victima.procedimiento = ''),
          (this.data_victima.horaTraslado = ''),
          (this.data_victima.horaLlegadaCasaMedica = '');
        this.loadingRegistrarVictimas = false;
      },
      error: (d) => {
        this.loadingRegistrarVictimas = false;
        this.formNuevaVictima = false;
        Swal.fire({
          icon: 'error',
          text: `Ha ocurrido un error, intente de nuevo.`,
          showCancelButton: true,
          confirmButtonColor: 'secondary',
          cancelButtonColor: 'info',
          confirmButtonText: 'Intentar de nuevo',
          cancelButtonText: 'Cancelar',
          color: 'text-900',
          customClass: {
            popup: 'background-color: #ea0505',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.formNuevaVictima = true;
            this.loadingRegistrarVictimas = false;
          } else {
            this.formNuevaVictima = false;
            (this.data_victima.ciVictima = ''),
              (this.data_victima.nombresVictima = ''),
              (this.data_victima.fechaNacimientoVictima = ''),
              (this.data_victima.telefonoVictima = ''),
              (this.data_victima.casaMedica = ''),
              (this.procedimientoSeleccionado = []),
              (this.data_victima.horaTraslado = ''),
              (this.data_victima.horaLlegadaCasaMedica = '');
          }
        });
      },
    });
  }

  mensajeCampoRequeridoVictima: boolean = false;
  mensajeCampoRequeridoVictimaProcedimiento: boolean = false;
  mensajeCampoRequeridoVictimaName: boolean = false;
  mensajeFechaInvalida: boolean = false;

  uuidSeleccionadoVictima: string = '';
  btn_abrir_form_actualizar_victima(uuidRegistro: string) {
    this.formActualizarVictima = true;
    this.uuidSeleccionadoVictima = uuidRegistro;
    this.parteService.un_victima(this.uuidSeleccionadoVictima).subscribe({
      next: (data) => {
        // this.data_victima = data.data;
        this.data_victima_update = data.data;
      },
    });
  }

  btn_guardar_actualizado_victima(victima: DataVictima) {
    this.loading_actualizar_data_victima = true;

    const dataVictima = {
      ciVictima: victima.ciVictima,
      nombresVictima: victima.nombresVictima,
      fechaNacimientoVictima: victima.fechaNacimientoVictima,
      telefonoVictima: victima.telefonoVictima,
      procedimiento: victima.procedimiento,
      casaMedica: victima.casaMedica,
      horaTraslado: victima.horaTraslado,
      horaLlegadaCasaMedica: victima.horaLlegadaCasaMedica,
    } as unknown as DataVictima;

    if (!victima.nombresVictima || !victima.procedimiento) {
      this.mensajeCampoRequeridoVictima = true;
      this.loading_actualizar_data_victima = false;
      return;
    }

    if (victima.fechaNacimientoVictima > obtenerFechaHoraActual().fecha) {
      this.mensajeFechaInvalida = true;
      this.loading_actualizar_data_victima = false;
      return;
    }
    console.log('d victima update', dataVictima);

    this.parteService
      .actualizar_victima(this.uuidSeleccionadoVictima, dataVictima)
      .subscribe({
        next: async (response) => {
          await this.obtener_lista_victimas();
          this.formActualizarVictima = false;
          this.loading_actualizar_data_victima = false;
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            text: `${response.message}`,
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            toast: true,
          });
          (this.data_victima.ciVictima = ''),
            (this.data_victima.nombresVictima = ''),
            (this.data_victima.fechaNacimientoVictima = ''),
            (this.data_victima.telefonoVictima = ''),
            (this.data_victima.casaMedica = ''),
            (this.data_victima.procedimiento = ''),
            (this.data_victima.horaTraslado = ''),
            (this.data_victima.horaLlegadaCasaMedica = '');
        },
        error: (error) => {
          this.loading_actualizar_data_victima = false;
          this.formActualizarVictima = false;
          Swal.fire({
            icon: 'error',
            text: `Ha ocurrido un error, intente de nuevo.`,
            showCancelButton: true,
            confirmButtonColor: 'secondary',
            cancelButtonColor: 'info',
            confirmButtonText: 'Intentar de nuevo',
            cancelButtonText: 'Cancelar',
            color: 'text-900',
            customClass: {
              popup: 'background-color: #ea0505',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.formActualizarVictima = true;
              this.loading_actualizar_data_victima = false;
            } else {
              this.formNuevaVictima = false;
              (this.data_victima.ciVictima = ''),
                (this.data_victima.nombresVictima = ''),
                (this.data_victima.fechaNacimientoVictima = ''),
                (this.data_victima.telefonoVictima = ''),
                (this.data_victima.casaMedica = ''),
                (this.data_victima.procedimiento = ''),
                (this.data_victima.horaTraslado = ''),
                (this.data_victima.horaLlegadaCasaMedica = '');
            }
          });
        },
      });
  }

  btn_eliminar_victima(uuidRegistro: string) {
    Swal.fire({
      icon: 'warning',
      text: `¿Está seguro de querer eliminar los datos de la victima?`,
      showCancelButton: true,
      confirmButtonColor: '#16A34A',
      cancelButtonColor: 'info',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parteService.eliminar_victima(uuidRegistro).subscribe({
          next: (response) => {
            this.obtener_lista_victimas();
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: `${response.message}`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
            });
          },
          error: (d) => {
            console.log('error', d);
            Swal.fire({
              position: 'bottom-end',
              icon: 'error',
              text: `Ocurrio un error, intentelo de nuevo`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
              toast: true,
            });
          },
        });
      }
    });
  }

  // AFECTADOS
  btn_agregar_afectado() {
    this.loading_agregar_afectado = true;
    setTimeout(() => {
      this.loading_agregar_afectado = false;
      this.form_nuevo_afectado = true;
    }, 1000);
  }

  mensajeCampoRequeridoAfectado: boolean = false;
  btn_registrar_afectado() {
    this.loading_guardar_afectado = true;

    const dataNueva = {
      ciAfectado: this.data_nuevo_afectado.ciAfectado,
      nombresAfectado: this.data_nuevo_afectado.nombresAfectado,
      fechaNacimientoAfectado: this.data_nuevo_afectado.fechaNacimientoAfectado,
      telefonoAfectado: this.data_nuevo_afectado.telefonoAfectado,
    } as DataRegistroAfectado;

    if (
      !this.data_nuevo_afectado.ciAfectado ||
      !this.data_nuevo_afectado.nombresAfectado
    ) {
      this.mensajeCampoRequeridoAfectado = true;
      this.loading_guardar_afectado = false;
      return;
    }
    this.parteService.registrar_afectado(this.uuidParams, dataNueva).subscribe({
      next: (response) => {
        this.obtener_lista_afectados();
        this.loading_guardar_afectado = false;
        this.form_nuevo_afectado = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: `${response.message}`,
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
        });
        (this.data_nuevo_afectado.ciAfectado = ''),
          (this.data_nuevo_afectado.nombresAfectado = ''),
          (this.data_nuevo_afectado.fechaNacimientoAfectado = ''),
          (this.data_nuevo_afectado.telefonoAfectado = '');
      },
      error: (d) => {
        this.loading_guardar_afectado = false;
        this.form_nuevo_afectado = false;

        Swal.fire({
          icon: 'error',
          text: `Ha ocurrido un error, intente de nuevo.`,
          showCancelButton: true,
          confirmButtonColor: 'secondary',
          cancelButtonColor: 'info',
          confirmButtonText: 'Intentar de nuevo',
          cancelButtonText: 'Cancelar',
          color: 'text-900',
          customClass: {
            popup: 'background-color: #ea0505',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.form_nuevo_afectado = true;
            this.loading_guardar_afectado = false;
          } else {
            (this.data_nuevo_afectado.ciAfectado = ''),
              (this.data_nuevo_afectado.nombresAfectado = ''),
              (this.data_nuevo_afectado.fechaNacimientoAfectado = ''),
              (this.data_nuevo_afectado.telefonoAfectado = '');
          }
        });
      },
    });
  }

  uuidSeleccionado: string = '';
  btn_abrir_form_actualizar_afectado(uuidRegistro: string) {
    this.form_actualizar_afectado = true;
    this.uuidSeleccionado = uuidRegistro;
    this.parteService.un_afectado(this.uuidSeleccionado).subscribe({
      next: (data) => {
        this.data_afectado_update = data.data;
      },
    });
  }

  btn_guardar_actualizado_afectado(afectado: DataActualizarAfectado) {
    this.form_actualizar_afectado = true;
    this.loading_actualizar_afectado = true;
    const dataok = {
      ciAfectado: afectado.ciAfectado,
      nombresAfectado: afectado.nombresAfectado,
      fechaNacimientoAfectado: afectado.fechaNacimientoAfectado,
      telefonoAfectado: afectado.telefonoAfectado,
    } as DataActualizarAfectado;

    if (!afectado.ciAfectado || !afectado.nombresAfectado) {
      this.loading_actualizar_afectado = false;
      this.mensajeCampoRequeridoAfectado = true;
      return;
    }

    if (afectado.fechaNacimientoAfectado > obtenerFechaHoraActual().fecha) {
      this.mensajeFechaInvalida = true;
      this.loading_actualizar_afectado = false;
      return;
    }

    this.parteService
      .actualizar_afectado(this.uuidSeleccionado, dataok)
      .subscribe({
        next: (response) => {
          this.form_actualizar_afectado = false;
          this.loading_actualizar_afectado = false;
          this.obtener_lista_afectados();
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            text: `${response.message}`,
            showConfirmButton: false,
            timer: 3500,
            timerProgressBar: true,
            toast: true,
          });
        },
        error: (d) => {
          this.form_actualizar_afectado = false;
          this.loading_actualizar_afectado = false;
          Swal.fire({
            icon: 'error',
            text: `Ha ocurrido un error, intente de nuevo.`,
            showCancelButton: true,
            confirmButtonColor: 'secondary',
            cancelButtonColor: 'info',
            confirmButtonText: 'Intentar de nuevo',
            cancelButtonText: 'Cancelar',
            color: 'text-900',
            customClass: {
              popup: 'background-color: #ea0505',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.form_actualizar_afectado = true;
              this.loading_actualizar_afectado = false;
            } else {
              this.form_actualizar_afectado = false;
            }
          });
        },
      });
  }

  btn_eliminar_afectado(uuidRegistro: string) {
    Swal.fire({
      icon: 'warning',
      text: `¿Está seguro de querer eliminar los datos de la persona afectada?`,
      showCancelButton: true,
      confirmButtonColor: '#16A34A',
      cancelButtonColor: 'info',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cerrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.parteService.eliminar_afectado(uuidRegistro).subscribe({
          next: (response) => {
            this.obtener_lista_afectados();
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: `${response.message}`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
            });
          },
          error: (d) => {
            Swal.fire({
              position: 'bottom-end',
              icon: 'error',
              text: `Ocurrio un error, intentelo de nuevo`,
              showConfirmButton: false,
              timer: 3500,
              timerProgressBar: true,
              toast: true,
            });
          },
        });
      }
    });
  }
}
