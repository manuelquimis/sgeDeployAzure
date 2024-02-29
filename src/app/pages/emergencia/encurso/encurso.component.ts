import { CompletarRoutingModule } from './../../parte/completar/completar-routing.module';
import { Data } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EncursoService } from './encurso.service';
import {
  DataComplementariaEmergencia,
  DataRowEmergencia,
  DataUnidadesInterface,
  EliminarUnidadInterface,
  EmpleadoInterface,
  RegistrarUnidadInterface,
  VehiculoInterface,
} from 'src/app/interfaces';
import { obtenerFechaHoraActual } from 'src/app/functions';
import { TokenService } from '../../auth/token.service';

@Component({
  selector: 'app-encurso',
  templateUrl: './encurso.component.html',
  providers: [],
})
export class EncursoComponent implements OnInit {
  mostrarIndicadorCarga: boolean = true;
  contadorEmergenciasAtendidas: number = 0;
  contadorVehiculosMovilizados: number = 0;

  dataEnCursos!: any[];
  clonedDataEnCursos: { [s: string]: any } = {};
  dataComplementaria: DataComplementariaEmergencia = {
    ciSolicitante: '',
    telefonoSolicitante: '',
    nombresCompletoSolicitante: '',
    // ecu911: false,
    observacionRadioOperador: '',
    estadoEmergencia: '',
    viviendaLocal: '',
    presenciaPolicial: '',
    esConfirmada: '',
    horaLlamada: '',
  };

  unidadDataUpdate: DataUnidadesInterface = {
    claseUnidad: '',
    estacionUnidad: '',
    estadoUnidad: '',
    fechaRegistro: '',
    horaLlegadaEmergencia: '',
    horaLlegadaEstacion: '',
    horaRegistro: '',
    horaSalidaEstacion: '',
    horaTrabajoTerminado: '',
    kmEntrada: '',
    kmSalida: '',
    nombreUnidad: '',
    razonEliminacion: '',
    tipoUnidad: '',
    uuidUnidad: '',
    uuidVehiculoSeleccionado: '',
    cedulaMaquinista: '',
    nombresMaquinista: '',
    rangoMaquinista: '',
    cargoMaquinista: '',
    idMaquinista: '',
    horaLlegadaCasaMedica: '',
    uuidEmergenciaFk: '',
  };

  loadingReporteGuardia: boolean = false;
  loadingGuardarDatos: boolean = false;
  loadingFinalizarEmergencia: boolean = false;

  loading_unidad_guardada: boolean = false;

  visible: boolean = false;

  loading: boolean = true;
  datosVehiculos: VehiculoInterface[] = [];

  constructor(private readonly encursoService: EncursoService, private readonly tokenService: TokenService) {}

  formAddData: boolean = false;

  formulario_agregar_unidad: boolean = false;

  unidadesEnUso: DataUnidadesInterface[] = [];

  empleados: EmpleadoInterface[] = [];
  maquinistas: EmpleadoInterface[] = [];

  rolUsuario: string = ''
  ngOnInit() {
    this.obtener_vehiculos();
    this.obtener_empleados();
    this.obtener_cantidad_emergencias_atendidas();
    this.obtener_cantidad_vehiculos_movilizados();
    this.obtener_emergencias_encurso();
    this.rolUsuario = this.tokenService.getRolesUsuario()
  }

  async obtener_vehiculos() {
    try {
      const response = await this.encursoService.obtenerVehiculos().toPromise();
      this.datosVehiculos = response.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        text: `No fue posible acceder a los registros de vehículos.`,
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        toast: true,
      });
    }
  }

  empleadoSeleccionado!: EmpleadoInterface;
  async obtener_empleados() {
    try {
      const response = await this.encursoService
        .obtenerMaquinistas()
        .toPromise();
      this.empleados = response.data;
      this.maquinistas = this.empleados.filter(
        (empleado) => empleado.cargoEmpleado === 'Maquinista'
      );
    } catch (error) {
      console.log('Maquinistas: ', error);
    }
  }

  async obtener_cantidad_emergencias_atendidas() {
    try {
      const response = await this.encursoService
        .obtenerCantidadEmergenciasAtendidas()
        .toPromise();
      this.contadorEmergenciasAtendidas = response.count;
    } catch (error) {
      console.log(error);
    }
  }

  async obtener_cantidad_vehiculos_movilizados() {
    try {
      const response = await this.encursoService
        .cantidadVehiculosMovilizados()
        .toPromise();
      this.contadorVehiculosMovilizados = response.data;
      setTimeout(() => {
        // this.mostrarIndicadorCarga = false;
      }, 1000);
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: `No fue posible atender su solicitud.`,
        showConfirmButton: true,
        timerProgressBar: true,
      });
    }
  }

  async obtener_emergencias_encurso() {
    try {
      const response = await this.encursoService
        .obtenerEmergenciasEnCurso()
        .toPromise();
      this.dataEnCursos = response.data;
      setTimeout(() => {
        this.mostrarIndicadorCarga = false;
      }, 500);
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: `No fue posible resolver su solicitud.`,
        showConfirmButton: true,
        timerProgressBar: true,
      });
    }
  }

  // EMERGENCIA

  // UNIDAD - VEHICULO
  uuidEmergencia_unidad!: any;
  btn_agregar_unidad(uuid: string) {
    this.formulario_agregar_unidad = true;
    this.uuidEmergencia_unidad = uuid;
    // this.obtener_vehiculos();
    // this.obtener_cantidad_vehiculos_movilizados();
  }

  vehiculosSeleccionados: VehiculoInterface[] = [];
  btn_guardar_unidad() {
    if (this.vehiculosSeleccionados.length > 0) {
      this.formulario_agregar_unidad = false;
      Swal.fire({
        text: '¿Está seguro de asignar estos recursos a la emergencia?',
        showCancelButton: true,
        icon: 'question',
        confirmButtonColor: 'secondary',
        cancelButtonColor: 'info',
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          for (const vehiculo of this.vehiculosSeleccionados) {
            const unidadAAsignar = {
              estacionUnidad: vehiculo.estacionVehiculo,
              nombreUnidad: vehiculo.nombreVehiculo,
              tipoUnidad: vehiculo.tipoVehiculo,
              claseUnidad: vehiculo.claseVehiculo,
              kmSalida: vehiculo.kmInicial,
              idUnidad: vehiculo.id,
            };

            this.encursoService
              .asignarUnidad(this.uuidEmergencia_unidad, unidadAAsignar)
              .subscribe({
                next: async (response) => {
                  await this.actualizar_estado_vehiculo_asignado(
                    response.data.idUnidad
                  );
                  await this.obtener_emergencias_encurso();
                  await this.obtener_vehiculos();
                  await this.obtener_cantidad_vehiculos_movilizados();
                  // Swal.fire({
                  //   position: 'center',
                  //   icon: 'success',
                  //   text: `${response.message}`,
                  //   showConfirmButton: false,
                  //   timerProgressBar: true,
                  //   timer: 2500,
                  // });
                  this.vehiculosSeleccionados = [];
                },
                error: (e) => {
                  console.log(e);

                  this.formulario_agregar_unidad = false;
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    text: `No fue posible atender su solicitud.`,
                    showConfirmButton: true,
                    timerProgressBar: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.formulario_agregar_unidad = true;
                    } else if (result.dismiss) {
                      this.formulario_agregar_unidad = true;
                    }
                  });
                },
              });
          }
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: `Recurso asignado`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2500,
          });
        } else {
          this.formulario_agregar_unidad = true;
        }
      });
    } else {
      this.formulario_agregar_unidad = false;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: `Debe seleccionar al menos una unidad.`,
        showConfirmButton: true,
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.formulario_agregar_unidad = true;
        } else if (result.dismiss) {
          this.formulario_agregar_unidad = true;
        }
      });
    }
  }

  async actualizar_estado_vehiculo_asignado(uuidRegistro: string) {
    try {
      const response = await this.encursoService
        .actualizarEstadoVehiculoAsignado(uuidRegistro)
        .toPromise();
    } catch (error) {
      console.log('', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        text: `No fue posible atender su solicitud.`,
        showConfirmButton: true,
        timerProgressBar: true,
      });
    }
  }

  async actualizar_estado_vehiculo_eliminado(uuidRegistro: string) {
    try {
      const response = await this.encursoService
        .actualizarEstadoVehiculoEliminado(uuidRegistro)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // UNIDAD
  form_eliminar_unidad: boolean = false;
  uuidUnidadSeleccionadaEliminar: string = '';
  estadoEmpleadoDisponible: string = '';
  btn_abrir_modal_eliminar_unidad(registro: any) {
    this.uuidUnidadSeleccionadaEliminar = registro.uuidUnidad;
    this.estadoEmpleadoDisponible = registro.idMaquinista;
    Swal.fire({
      html: `¿Está seguro de desea eliminar la unidad <strong>${registro.nombreUnidad}</strong> de esta emergencia?`,
      showCancelButton: true,
      icon: 'question',
      confirmButtonColor: 'secondary',
      cancelButtonColor: 'info',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.estadoEmpleadoDisponible) {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            html: `La unidad <strong>${registro.nombreUnidad}</strong> no puede ser eliminada, no tiene registros del maquinista.`,
            showConfirmButton: true,
            timerProgressBar: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.form_eliminar_unidad = false;
            } else if (result.dismiss) {
              this.form_eliminar_unidad = false;
            }
          });
        } else {
          this.form_eliminar_unidad = true;
        }
      }
    });
  }

  dataEliminarUnidad: EliminarUnidadInterface = {
    razonEliminacion: '',
  };
  mostrarErrorRazonEliminacion: boolean = false;
  minimoCaracteres: boolean = false;
  textoLimpio: boolean = false;
  sinCaracterEspecial: boolean = false;
  async btn_eliminar_unidad(razon: EliminarUnidadInterface) {

    if (this.dataEliminarUnidad.razonEliminacion.trim() === '') {
      this.mostrarErrorRazonEliminacion = true;
    }

    if (this.dataEliminarUnidad.razonEliminacion.length === 0) {
      this.minimoCaracteres = false;
    } else if (this.dataEliminarUnidad.razonEliminacion.length < 14) {
      this.minimoCaracteres = true;
    }

    if (
      this.mostrarErrorRazonEliminacion == false &&
      this.minimoCaracteres == false
    ) {
      this.encursoService
        .eliminarUnidad(this.uuidUnidadSeleccionadaEliminar, razon)
        .subscribe({
          next: async (response) => {
            await this.actualizar_estado_vehiculo_eliminado(
              response.data.idUnidad
            );
            await this.actualizar_estado_maquinistaDisponible(
              this.estadoEmpleadoDisponible
            );
            await this.obtener_emergencias_encurso();
            await this.obtener_vehiculos();
            await this.obtener_cantidad_vehiculos_movilizados();
            await this.obtener_empleados()
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: `${response.message}`,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2500,
            });
            this.form_eliminar_unidad = false;
            this.dataEliminarUnidad.razonEliminacion = '';
          },
          error: (err) => {
            console.log('error-eliminar:', err);

            Swal.fire({
              position: 'center',
              icon: 'error',
              text: `No fue posible atender su solicitud.`,
              showConfirmButton: true,
              timerProgressBar: true,
            });
          },
        });
    }
  }

  limpiarEspacios() {
    // Elimina espacios en blanco al principio y al final
    this.dataEliminarUnidad.razonEliminacion =
      this.dataEliminarUnidad.razonEliminacion.trim();
    // Reemplaza múltiples espacios en blanco por uno solo
    this.dataEliminarUnidad.razonEliminacion =
      this.dataEliminarUnidad.razonEliminacion.replace(/\s\s+/g, ' ');
    // Elimina espacios en blanco al inicio de la primera palabra
    this.dataEliminarUnidad.razonEliminacion =
      this.dataEliminarUnidad.razonEliminacion.replace(/^\s+/, '');
  }

  limpiarCaracteresEspeciales() {
    const texto = this.dataEliminarUnidad.razonEliminacion;
    // Validar si hay caracteres especiales y limpiarlos
    const textoSinEspeciales = texto.replace(/[^\w\s-]/g, '');
    // Actualizar la propiedad con el texto limpio
    this.dataEliminarUnidad.razonEliminacion = textoSinEspeciales;
  }

  btn_eliminar_unidad_cancelar() {
    this.form_eliminar_unidad = false;
  }

  // MAQUINISTA
  form_asignrMaquinista: boolean = false;
  datos_unidadMaquinista!: DataUnidadesInterface;

  async btn_form_asignarMaquinista(registro: DataUnidadesInterface) {
    this.datos_unidadMaquinista = registro;
    // await this.obtener_empleados();
    if (this.datos_unidadMaquinista.cargoMaquinista === null) {
      this.form_asignrMaquinista = true;
    } else {
      this.form_asignrMaquinista = false;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        // text: `Ya se ha asignado maquinista para esta unidad.`,
        html: `Ya se ha asignado maquinista para esta unidad.<ul style="text-align: left; list-style-type: disc;"><li><strong>Unidad:</strong> ${this.datos_unidadMaquinista.nombreUnidad}</li><li><strong>Maquinista:</strong> ${this.datos_unidadMaquinista.nombresMaquinista}</li></ul>`,
        showConfirmButton: true,
        timerProgressBar: true,
      });
    }
  }

  agregarMaquinista() {
    if (this.empleadoSeleccionado) {
      this.form_asignrMaquinista = false;
      Swal.fire({
        html: `¿Está seguro de asignar este maquinista a la unidad seleccionada <strong>${this.datos_unidadMaquinista.nombreUnidad}</strong>? Una vez asignado no podrá ser removido, si necesita realizarlo incluyalo en el apartado de observaciones.`,
        showCancelButton: true,
        icon: 'question',
        confirmButtonColor: 'secondary',
        cancelButtonColor: 'info',
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const maquinista = {
            idMaquinista: this.empleadoSeleccionado.id,
            nombresMaquinista: this.empleadoSeleccionado.nombresEmpleado,
            cedulaMaquinista: this.empleadoSeleccionado.cedulaEmpleado,
            cargoMaquinista: this.empleadoSeleccionado.cargoEmpleado,
            rangoMaquinista: this.empleadoSeleccionado.rangoEmpleado,
          } as DataUnidadesInterface;

          this.encursoService
            .asignarMaquista(this.datos_unidadMaquinista.uuidUnidad, maquinista)
            .subscribe({
              next: async (response) => {
                await this.actualizar_estado_maquinista(
                  this.empleadoSeleccionado.id
                );
                await this.obtener_empleados();
                await this.obtener_emergencias_encurso();
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  text: `${response.message}`,
                  showConfirmButton: false,
                  timerProgressBar: true,
                  timer: 2500,
                });
                this.empleadoSeleccionado = {
                  id: '',
                  cedulaEmpleado: '',
                  nombresEmpleado: '',
                  cargoEmpleado: '',
                  rangoEmpleado: '',
                  estadoEmpleado: '',
                };
              },
              error: (err) => {
                console.log(err);
              },
            });
        } else {
          this.form_asignrMaquinista = true;
        }
      });
    } else {
      this.form_asignrMaquinista = false;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: `Debe seleccionar un maquinista.`,
        showConfirmButton: true,
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.form_asignrMaquinista = true;
        } else if (result.dismiss) {
          this.form_asignrMaquinista = true;
        }
      });
    }
  }

  async actualizar_estado_maquinista(uuidRegistro: string) {
    try {
      const response = await this.encursoService
        .actualizarEstadoEmpleadosAsignados(uuidRegistro)
        .toPromise();
    } catch (error) {
      console.log(error);

      Swal.fire({
        position: 'center',
        icon: 'error',
        text: `No fue posible atender su solicitud.`,
        showConfirmButton: true,
        timerProgressBar: true,
      });
    }
  }

  async actualizar_estado_maquinistaDisponible(uuidRegistro: string) {
    try {
      const response = await this.encursoService
        .actualizarEstadoEmpleadosDisponible(uuidRegistro)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  // verificar
  onRowEditInit(dataRowEmergencia: DataRowEmergencia) {
    this.clonedDataEnCursos[dataRowEmergencia.uuidEmergencia as string] = {
      ...dataRowEmergencia,
    };
  }

  onRowEditSave(dataRowEmergencia: DataRowEmergencia) {
    delete this.clonedDataEnCursos[dataRowEmergencia.uuidEmergencia as string];
    const data = {
      direccion: dataRowEmergencia.direccion,
      barrio: dataRowEmergencia.barrio,
      codEmergencia: dataRowEmergencia.codEmergencia,
      desEmergencia: dataRowEmergencia.desEmergencia,
    } as DataRowEmergencia;

    this.encursoService
      .actualizar_emergencia_encurso(dataRowEmergencia.uuidEmergencia, data)
      .subscribe();
  }

  onRowEditCancel(dataRowEmergencia: any, index: number) {
    this.dataEnCursos[index] =
      this.clonedDataEnCursos[dataRowEmergencia.uuidEmergencia as string];
    delete this.clonedDataEnCursos[dataRowEmergencia.uuidEmergencia as string];
  }

  clonedDataUnidad: { [s: string]: any } = {};
  onRowEditInitUnidad(dataRowUnidad: DataUnidadesInterface) {
    this.clonedDataUnidad[dataRowUnidad.uuidUnidad as string] = {
      ...dataRowUnidad,
    };
  }

  onRowEditSaveUnidadHSE(dataRowUnidad: DataUnidadesInterface) {
    const datos = {
      horaSalidaEstacion: dataRowUnidad.horaSalidaEstacion,
      horaLlegadaEmergencia: dataRowUnidad.horaLlegadaEmergencia,
      horaTrabajoTerminado: dataRowUnidad.horaTrabajoTerminado,
      horaLlegadaEstacion: dataRowUnidad.horaLlegadaEstacion,
      kmEntrada: dataRowUnidad.kmEntrada,
    } as DataUnidadesInterface;

    const infoEmergencia: any = dataRowUnidad.uuidEmergenciaFk;

    if (
      infoEmergencia.horaDespacho > dataRowUnidad.horaSalidaEstacion &&
      obtenerFechaHoraActual().fecha <= infoEmergencia.fechaDespacho
    ) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `La <strong>H. Salida Estación</strong> ingresada no puede ser menor a la <strong>H. Despacho</strong> de la emergencia.`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      dataRowUnidad.horaSalidaEstacion = '';
      return;
    }

    this.encursoService
      .actualizarUnidad(dataRowUnidad.uuidUnidad, datos)
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
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: `No fue posible resolver su solicitud.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
            toast: true,
          });
        },
      });
  }

  onRowEditSaveUnidadHLlE(dataRowUnidad: DataUnidadesInterface) {
    const datos = {
      horaSalidaEstacion: dataRowUnidad.horaSalidaEstacion,
      horaLlegadaEmergencia: dataRowUnidad.horaLlegadaEmergencia,
      horaTrabajoTerminado: dataRowUnidad.horaTrabajoTerminado,
      horaLlegadaEstacion: dataRowUnidad.horaLlegadaEstacion,
      kmEntrada: dataRowUnidad.kmEntrada,
    } as DataUnidadesInterface;

    const infoEmergencia: any = dataRowUnidad.uuidEmergenciaFk;
    if (
      dataRowUnidad.horaSalidaEstacion >= dataRowUnidad.horaLlegadaEmergencia &&
      obtenerFechaHoraActual().fecha <= infoEmergencia.fechaDespacho
    ) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `La <strong>H. Llegada Emergencia</strong> ingresada no puede ser menor a la <strong>H. Salida Estación</strong>.`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      dataRowUnidad.horaLlegadaEmergencia = '';
      return;
    }

    this.encursoService
      .actualizarUnidad(dataRowUnidad.uuidUnidad, datos)
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
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: `No fue posible resolver su solicitud.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
            // toast: true
          });
        },
      });
  }

  onRowEditSaveUnidadHTT(dataRowUnidad: DataUnidadesInterface) {
    const datos = {
      horaSalidaEstacion: dataRowUnidad.horaSalidaEstacion,
      horaLlegadaEmergencia: dataRowUnidad.horaLlegadaEmergencia,
      horaTrabajoTerminado: dataRowUnidad.horaTrabajoTerminado,
      horaLlegadaEstacion: dataRowUnidad.horaLlegadaEstacion,
      kmEntrada: dataRowUnidad.kmEntrada,
    } as DataUnidadesInterface;

    const infoEmergencia: any = dataRowUnidad.uuidEmergenciaFk;
    if (
      dataRowUnidad.horaLlegadaEmergencia >=
        dataRowUnidad.horaTrabajoTerminado &&
      obtenerFechaHoraActual().fecha <= infoEmergencia.fechaDespacho
    ) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `La <strong>H. Trabajo Terminado</strong> ingresada no puede ser menor a la <strong>H. Llegada Emergencia</strong>.`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      dataRowUnidad.horaTrabajoTerminado = '';
      return;
    }

    this.encursoService
      .actualizarUnidad(dataRowUnidad.uuidUnidad, datos)
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
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: `No fue posible resolver su solicitud.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
            // toast: true
          });
        },
      });
  }

  onRowEditSaveUnidadHLlEs(dataRowUnidad: DataUnidadesInterface) {
    const datos = {
      horaSalidaEstacion: dataRowUnidad.horaSalidaEstacion,
      horaLlegadaEmergencia: dataRowUnidad.horaLlegadaEmergencia,
      horaTrabajoTerminado: dataRowUnidad.horaTrabajoTerminado,
      horaLlegadaEstacion: dataRowUnidad.horaLlegadaEstacion,
      kmEntrada: dataRowUnidad.kmEntrada,
    } as DataUnidadesInterface;

    const infoEmergencia: any = dataRowUnidad.uuidEmergenciaFk;
    if (
      dataRowUnidad.horaTrabajoTerminado >= dataRowUnidad.horaLlegadaEstacion &&
      obtenerFechaHoraActual().fecha <= infoEmergencia.fechaDespacho
    ) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `La <strong>H. Llegada Estación</strong> ingresada no puede ser menor a la <strong>H Trabajo Terminado</strong>.`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      dataRowUnidad.horaLlegadaEstacion = '';
      return;
    }

    this.encursoService
      .actualizarUnidad(dataRowUnidad.uuidUnidad, datos)
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
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: `No fue posible resolver su solicitud.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
            // toast: true
          });
        },
      });
  }

  onRowEditSaveUnidadKm(dataRowUnidad: DataUnidadesInterface) {
    const datos = {
      horaSalidaEstacion: dataRowUnidad.horaSalidaEstacion,
      horaLlegadaEmergencia: dataRowUnidad.horaLlegadaEmergencia,
      horaTrabajoTerminado: dataRowUnidad.horaTrabajoTerminado,
      horaLlegadaEstacion: dataRowUnidad.horaLlegadaEstacion,
      kmEntrada: dataRowUnidad.kmEntrada,
    } as DataUnidadesInterface;

    const kmEntrada = parseInt(datos.kmEntrada, 10);
    const kmSalida = parseInt(dataRowUnidad.kmSalida, 10);

    if (isNaN(kmEntrada) || isNaN(kmSalida) || kmEntrada <= kmSalida) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `El <strong>Km Entrada</strong> ingresado no puede ser menor o igual al <strong>Km Salida</strong>.`,
        showConfirmButton: true,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      dataRowUnidad.kmEntrada = '';
      return;
    }

    this.encursoService
      .actualizarUnidad(dataRowUnidad.uuidUnidad, datos)
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
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: `No fue posible resolver su solicitud.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
            // toast: true
          });
        },
      });
  }

  onRowEditCancelUnidad(dataRowUnidad: any, index: number) {
    // Obtener la copia de seguridad de los datos originales
    const originalData =
      this.clonedDataUnidad[dataRowUnidad.uuidUnidad as string];

    // Si hay datos originales, restaurarlos en el arreglo de unidades
    if (originalData) {
      // Asegúrate de restaurar en el arreglo correcto (vehiculo.unidades)
      dataRowUnidad.unidades = [...originalData.unidades];
    }

    // Limpiar la copia de seguridad
    delete this.clonedDataUnidad[dataRowUnidad.uuidUnidad as string];
  }

  // btn-purple

  // btn-blue

  uuidEmergenciaSeleccionada!: string;
  dataService: DataComplementariaEmergencia = {
    ciSolicitante: '',
    nombresCompletoSolicitante: '',
    observacionRadioOperador: '',
    telefonoSolicitante: '',
    estadoEmergencia: '',
    viviendaLocal: '',
    presenciaPolicial: '',
    esConfirmada: '',
    horaLlamada: '',
  };

  btn_agregar_datos_emergencia(uuidEmergencia: string) {
    this.uuidEmergenciaSeleccionada = uuidEmergencia;

    this.obtener_emergencias_encurso();
    // this.formAddData = true;
    // this.dataComplementaria = {
    //   ciSolicitante: this.dataService.ciSolicitante,
    //   nombresCompletoSolicitante: this.dataService.nombresCompletoSolicitante,
    //   telefonoSolicitante: this.dataService.telefonoSolicitante,
    //   observacionRadioOperador: this.dataService.observacionRadioOperador,
    //   esConfirmada: this.dataService.esConfirmada,
    //   horaLlamada: this.dataService.horaLlamada,
    //   presenciaPolicial: this.dataService.presenciaPolicial,
    //   viviendaLocal: this.dataService.viviendaLocal,
    // } as DataComplementariaEmergencia;

    // console.log('complemento: ', this.dataComplementaria);
    

    this.encursoService.obtenerUnaEmergenciaEnCurso(uuidEmergencia).subscribe({
      next: (data) => {
        this.dataService = data.data;

        this.dataComplementaria = {
          ciSolicitante: this.dataService.ciSolicitante,
          nombresCompletoSolicitante:
            this.dataService.nombresCompletoSolicitante,
          telefonoSolicitante: this.dataService.telefonoSolicitante,
          observacionRadioOperador: this.dataService.observacionRadioOperador,
          esConfirmada: this.dataService.esConfirmada,
          horaLlamada: this.dataService.horaLlamada,
          presenciaPolicial: this.dataService.presenciaPolicial,
          viviendaLocal: this.dataService.viviendaLocal,
        } as DataComplementariaEmergencia;
        this.formAddData = true;
      },
    });
  }

  btn_guardar_datos_emergencia(emergencia: any) {
    this.loadingGuardarDatos = true;

    setTimeout(() => {
      if (this.uuidEmergenciaSeleccionada) {
        this.encursoService
          .actualizar_emergencia_encurso(
            this.uuidEmergenciaSeleccionada,
            emergencia
          )
          .subscribe({
            next: (response) => {
              Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                text: `Datos registrados.`,
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                toast: true,
                color: 'text-900',
              });
              this.obtener_emergencias_encurso();
            },
            error: (error) => {},
          });
      } else {
        console.log('No fue posible identificar su uuid');
      }

      this.loadingGuardarDatos = false;
      this.formAddData = false;
    }, 1000);
  }

  async btn_finalizar_emergencia_encurso(emergencia: any) {
    this.loadingFinalizarEmergencia = true;

    const datosEmergencia = this.dataEnCursos.find(
      (item) => item.uuidEmergencia === this.uuidEmergenciaSeleccionada
    );

    if (datosEmergencia.unidades.length === 0) {
      this.formAddData = false;
      this.loadingFinalizarEmergencia = false;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        text: 'No se han asignado unidades a esta emergencia. Registre las respectivas unidades',
        showConfirmButton: true,
        timerProgressBar: true,
      });
      return;
    }
    if (datosEmergencia.unidades) {
      this.formAddData = false;
      this.loadingFinalizarEmergencia = false;
      const unidadesSinMaquinista = datosEmergencia.unidades.filter(
        (unidad: any) => !unidad.idMaquinista
      );
      if (unidadesSinMaquinista.length > 0) {
        const unidadesFaltantes = unidadesSinMaquinista
          .map((unidad: any) => unidad.nombreUnidad)
          .join(', ');

        Swal.fire({
          position: 'center',
          icon: 'warning',
          html: `Debe asignar un maquinista a todas sus unidades para poder finalizar:<p>  <strong> ${unidadesFaltantes} </strong> </p>.`,
          showConfirmButton: true,
          timerProgressBar: true,
        });
        return;
      } else {
        this.encursoService.actualizar_emergencia_encurso(datosEmergencia.uuidEmergencia, emergencia).subscribe()
        this.encursoService
          .finalizar_emergencia_encurso(datosEmergencia.uuidEmergencia)
          .subscribe({
            next: async (response) => {
              await this.obtener_emergencias_encurso();
              await this.obtener_cantidad_emergencias_atendidas();
              await this.obtener_cantidad_vehiculos_movilizados();
              await this.obtener_vehiculos();
              await this.obtener_empleados();

              Swal.fire({
                position: 'center',
                icon: 'success',
                text: `${response.message}`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 3500,
              });
              this.uuidEmergenciaSeleccionada = '';
            },
            error: (e) => {
              console.log('finalizar: ', e);
              Swal.fire({
                position: 'bottom-end',
                icon: 'error',
                text: `Ocurrió un error, inténtelo de nuevo.`,
                showConfirmButton: false,
                timer: 3500,
                timerProgressBar: true,
                toast: true,
              });
            },
          });
      }
    }
  }

  async actualizarEstadoVehiculoLibre(uuid: string) {
    try {
      const response = await this.encursoService
        .actualizarEstadoVehiculoLibre(uuid)
        .toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  isFinalizarButtonVisible: boolean = false;
  checkFinalizarButtonVisibility(): void {
    const {
      telefonoSolicitante,
      esConfirmada,
      horaLlamada,
      viviendaLocal,
      presenciaPolicial,
      observacionRadioOperador,
    } = this.dataComplementaria;

    this.isFinalizarButtonVisible = !!(
      telefonoSolicitante &&
      esConfirmada &&
      horaLlamada &&
      viviendaLocal &&
      presenciaPolicial &&
      observacionRadioOperador
    );
  }
}
