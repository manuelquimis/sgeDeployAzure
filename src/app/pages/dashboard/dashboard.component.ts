import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../components/layout/layout.service';
import { EncursoService } from '../emergencia/encurso/encurso.service';
import { ReporteDiarioInterface, VehiculoInterface } from 'src/app/interfaces';
import Swal from 'sweetalert2';
import { enviroment } from 'src/environments/enviroment';
import mapboxgl from 'mapbox-gl';
import { DashboardService } from './dashboard.service';
import { MenuItem } from 'primeng/api';
import { formatDate } from '@angular/common';
import { ReporteSemanalInterface } from 'src/app/interfaces/infoDashboard.interface';
import * as moment from 'moment';


@Component({
  selector: '',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartBarDiario') chartBarDiario!: ElementRef;
  @ViewChild('grafico') grafico: ElementRef | undefined;
  @ViewChild('content') content: ElementRef | undefined;

  loading: boolean = true;
  mostrarIndicadorCarga: boolean = true;

  datosGeoJson: any;

  items: MenuItem[] | any;

  dataBarStacked: any;
  optionsBarStacked: any;
  dataPie: any;
  optionsPie: any;
  dataBarBasic: any;
  optionsBarBasic: any;
  dataBar: any;
  optionsBar: any;

  dataPie1: any;

  datosVehiculos: VehiculoInterface[] = [];

  constructor(
    public layoutService: LayoutService,
    private readonly encursoService: EncursoService,
    private readonly dashboardService: DashboardService
  ) {}

  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--text-color');
  textColorSecondary = this.documentStyle.getPropertyValue(
    '--text-color-secondary'
  );
  surfaceBorder = this.documentStyle.getPropertyValue('--surface-border');

  ngOnInit() {
    this.obtenerVehiculos();

    this.obtenerFechaActual();
    //
    this.reporteDiario(this.fechaActual);
    //
    const fechaActual = moment();
    const fechaHace7Dias = fechaActual.clone().subtract(7, 'days').toDate();
    this.rangeDates = [fechaHace7Dias, fechaActual.toDate()];
    this.reporteSemanal(this.rangeDates);
    //
    const mesActual = new Date();
    const mesActualFormat = formatDate(mesActual, 'yyyy-MM', 'es-EC');
    this.dateD = mesActualFormat;
    this.reporteMensual(this.dateD);

    setTimeout(() => {
      this.obtenerDatosHeatMap();
      this.iniciarMapa();
    }, 5000);
  }

  async obtenerVehiculos() {
    try {
      const response = await this.encursoService.obtenerVehiculos().toPromise();
      if (response) {
        this.datosVehiculos = response.data;

        setTimeout(() => {
          this.mostrarIndicadorCarga = false;
        }, 500);
      }
    } catch (error) {
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

  async obtenerDatosHeatMap() {
    try {
      const response = await this.dashboardService
        .obtenerDatosHeatMap()
        .toPromise();
      if (response) {
        this.datosGeoJson = response.data;
        // console.log(this.datosGeoJson);
      }
    } catch (error) {
      console.log('error headmap: ', error);
    }
  }

  async iniciarMapa() {
    (mapboxgl as typeof mapboxgl).accessToken = enviroment.mapboxKey;
    const map = new mapboxgl.Map({
      container: 'mapp',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [enviroment.LONGITUD_MAP, enviroment.LATITUD_MAP],
      zoom: 11,
      interactive: false,
    });

    map.on('load', () => {
      map.addSource('earthquakes', {
        type: 'geojson',
        data: this.datosGeoJson,
      });

      map.addLayer(
        {
          id: 'earthquakes-heat',
          type: 'heatmap',
          source: 'earthquakes',
          maxzoom: 24,
          paint: {
            'heatmap-weight': 15,
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33,102,172,0)',
              0.2,
              'rgb(103,169,207)',
              0.4,
              'rgb(209,229,240)',
              0.6,
              'rgb(253,219,199)',
              0.8,
              'rgb(239,138,98)',
              1,
              'rgb(178,24,43)',
            ],
            'heatmap-radius': 7,
            'heatmap-opacity': 0.7,
          },
        },
        'waterway-label'
      );

      map.addLayer(
        {
          id: 'earthquakes-point',
          type: 'circle',
          source: 'earthquakes',
          maxzoom: 12,
          minzoom: 12,
          paint: {
            'circle-radius': 7,
            'circle-color': 'rgb(178,24,43)',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.7,
          },
        },
        'waterway-label'
      );
    });
  }

  fechaActual: any;
  obtenerFechaActual() {
    const fechaActualSistema = new Date();
    return (this.fechaActual = formatDate(
      fechaActualSistema,
      'yyyy-MM-dd',
      'es-EC'
    ) as Date | any);
  }

  fechaNueva: Date | any;
  datosReporteDiario_datasets: any;
  datosReporteDiario_labels: any;
  fechaDespacho: ReporteDiarioInterface = { fechaDespacho: '' };
  totalEncontrados_ReporteDiario: number = 0;
  mostrarMensajeDiaria: boolean = false;
  fechaActualDiaria: string = '';
  async reporteDiario(fecha: any) {
    const fechaFormat = formatDate(fecha, 'yyyy-MM-dd', 'es-EC') as any;
    // console.log('actual', this.fechaActual);
    // console.log('nueva', fechaFormat);
    // console.log('fun fa', this.obtenerFechaActual());

    if (this.obtenerFechaActual() < fechaFormat) {
      // console.log('alerta');

      // this.mostrarMensajeDiaria = true;
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `<p style="color: rgb(190, 31, 45)"
        class="text-sm">Seleccione la fecha de hoy o anterior.</p>`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
    } else {
      this.mostrarMensajeDiaria = false;
    } 

    const data = {
      fechaDespacho: fechaFormat,
    } as ReporteDiarioInterface;
    this.dashboardService.obtenerReporteDiario(data).subscribe({
      next: (response) => {
        this.datosReporteDiario_datasets = response.data.datasets;
        this.datosReporteDiario_labels = response.data.labels;
        this.totalEncontrados_ReporteDiario = response.total;

        this.dataBarBasic = {
          labels: this.datosReporteDiario_labels,
          datasets: this.datosReporteDiario_datasets,
        };
        this.optionsBarBasic = {
          plugins: {
            legend: {
              labels: {
                color: this.textColor,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
            x: {
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  rangeDates: any;
  totalEncontrados_ReporteSemanal: number = 0;
  datosReporteSemanal_datasets: any;
  datosReporteSemanal_labels: any;
  mostrarMensajeSemanal: boolean = false;
  rangos: ReporteSemanalInterface = {
    fechaInicio: '',
    fechaFin: '',
  };
  reporteSemanal(dato: any) {
    const fechaInicio = this.rangeDates[0];
    const fechaFin = this.rangeDates[1];

    const fechaInicioFormateada = formatDate(
      fechaInicio,
      'yyyy-MM-dd',
      'en-EC'
    );
    const fechaFinFormateada = formatDate(fechaFin, 'yyyy-MM-dd', 'en-EC');

    this.rangos = {
      fechaInicio: fechaInicioFormateada,
      fechaFin: fechaFinFormateada,
    } as ReporteSemanalInterface;
    const aa = formatDate(this.rangeDates[1], 'yyyy-MM-dd', 'es-EC');
    if (this.fechaActual < aa) {
      this.mostrarMensajeSemanal = true;
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `<p style="color: rgb(190, 31, 45)"
        class="text-sm">Seleccione un rango de fecha de hoy hacia atrás.</p>`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
      return;
      this.dataPie = {
        labels: null,
        datasets: null,
      };
    } else {
      this.mostrarMensajeSemanal = false;
    }

    this.dashboardService.obtenerReporteSemanal(this.rangos).subscribe({
      next: (response) => {
        (this.datosReporteSemanal_datasets = response.data.datasets),
          (this.datosReporteSemanal_labels = response.data.labels),
          (this.totalEncontrados_ReporteSemanal = response.total);

        this.dataPie = {
          labels: this.datosReporteSemanal_labels,
          datasets: this.datosReporteSemanal_datasets,
        };

        this.optionsPie = {
          cutout: '50%',
          maintainAspectRatio: false,
          aspectRatio: 0.9,
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: this.textColor,
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              stacked: true,
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  dateD: any;
  mostrarMensajeMensual: boolean = false;
  totalEncontrados_ReporteMensual: number = 0;
  reporteMensual(dato: any) {
    const nuevoMes = formatDate(dato, 'yyyy-MM', 'es-EC');
    if (this.obtenerFechaActual() < nuevoMes) {
      Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        html: `<p style="color: rgb(190, 31, 45)"
        class="text-sm">Seleccione el mes actual o anteriores.</p>`,
        showConfirmButton: false,
        timer: 4500,
        timerProgressBar: true,
        toast: true,
      });
    }

    const dataNuevo = {
      fechaDespacho: nuevoMes,
    } as ReporteDiarioInterface;

    this.dashboardService.obtenerReporteMensual(dataNuevo).subscribe({
      next: (response) => {
        this.totalEncontrados_ReporteMensual = response.total;
        this.dataBarStacked = {
          labels: response.data.labels,
          datasets: response.data.datasets,
        };
        this.optionsBarStacked = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            legend: {
              labels: {
                color: this.textColor,
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              stacked: true,
              ticks: {
                color: this.textColorSecondary,
              },
              grid: {
                color: this.surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


  public descargarComoPdf(): void {
  
  }


}
