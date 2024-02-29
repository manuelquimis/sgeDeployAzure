import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import mapboxgl, { Marker, Popup } from 'mapbox-gl';

import Swal from 'sweetalert2';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { DespacharService } from './despachar.service';
import { DataRegistroEmergencia } from 'src/app/interfaces/infoEmergencia.interface';
import { enviroment } from 'src/environments/enviroment';
import {
  CodigoHijoInterface,
  CodigosJsonInterface,
} from 'src/app/interfaces/infoCodigos.interface';
import { MenuItem } from 'primeng/api';
import { PlacesService } from './places.service';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../auth/token.service';

@Component({
  selector: 'app-despachar',
  templateUrl: './despachar.component.html',
  styleUrls: ['./despachar.component.scss'],
})
export class DespacharComponent implements OnInit {
  loadingRegistrarEmergencia: boolean = false;
  loadingLimpiarFormulario: boolean = false;
  loadingListarEmergencias: boolean = false;

  despacho: DataRegistroEmergencia = {
    direccion: '',
    codigoH: '',
    descripcionH: '',
    nivelH: '',
    tipoEmergencia: '',
    codigoP: '',
    descripcionP: '',
    nivelP: '',
    longitud: 0,
    latitud: 0,
    referencia: '',
    nombresRadioOperador: '',
  };

  formSubmitted = false;

  items!: MenuItem[];
  datosGeolocalizacion: any = {};
  coordenadasNuevas: any = {
    latitud: 0,
    longitud: 0,
  };

  marker!: mapboxgl.Marker;
  markerEnCurso!: mapboxgl.Marker;

  nombreUsuario: string = '';
  apellidosUsuario: string = '';

  constructor(
    private readonly router: Router,
    private readonly despacharService: DespacharService,
    private readonly placesService: PlacesService,
    private readonly tokenService: TokenService,
    private readonly httpClient: HttpClient
  ) {}

  get isUserLocationReady() {
    return this.placesService.isUserLocationReady;
  }

  ngOnInit() {
    this.nombreUsuario = this.tokenService.getNombreUsuario();
    this.apellidosUsuario = this.tokenService.getApellidosUsuario();

    // this.obtenerEmergenciasEnCurso();

    // this.iniciarMapa();
    this.cargarInfor();

    this.despacharService.cargarCodigosJson().subscribe({
      next: (response) => {
        this.listaCodigos = response.codigos;
        // console.log(this.listaCodigos);
      },
      error: (error) => {
        console.log('no se pudo cargar los códigos', error);
      },
    });
  }

  async iniciarMapa() {
    (mapboxgl as typeof mapboxgl).accessToken = enviroment.mapboxKey;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [enviroment.LONGITUD, enviroment.LATITUD],
      zoom: 13,
    });

    // Añadir control de navegación personalizado
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: false,
      },
      trackUserLocation: false,
      showUserLocation: false,
    });

    // map.addControl(geolocateControl);

    // Agregar un botón personalizado para volver a la ubicación inicial
    const volverUbicacionButton = document.createElement('button');
    volverUbicacionButton.textContent = 'Volver a Ubicación Inicial';
    volverUbicacionButton.className =
      'mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate';
    volverUbicacionButton.addEventListener('click', () => {
      map.flyTo({
        center: [enviroment.LONGITUD, enviroment.LATITUD],
        zoom: 12,
      });
    });

    // Agregar el botón personalizado al mapa
    // document.body.appendChild(volverUbicacionButton);

    // Itera sobre la lista de emergencias y agrega un marcador y pop-up para cada una
    this.despacharService.obtenerEmergenciasEnCurso().subscribe({
      next: (response) => {
        this.listaEmergenciasEC = response.data;

        this.listaEmergenciasEC.forEach((emergencia) => {
          // Obtener todos los nombres de unidades como un array
          const nombresUnidades = emergencia.unidades.map(
            (unidad: any) => unidad.nombreUnidad
          );

          const emergenciaPopup = new Popup().setHTML(`
            <h6><strong>Emergencia: </strong><br><span>${
              emergencia.tipoEmergencia
            }</span></h6> 
            <h6><strong>Dirección: </strong><br><span>${
              emergencia.direccion
            }</span></h6> 
            <h6><strong>Unidades: </strong><br><span>${nombresUnidades.join(
              ', '
            )}</span></h6> 
            <h6><strong>H. Despacho: </strong><br><span>${
              emergencia.horaDespacho
            }</span></h6> 
          `);

          const emergenciaMarker = new Marker({ color: 'orange' })
            .setLngLat([emergencia.longitud, emergencia.latitud])
            .setPopup(emergenciaPopup)
            .addTo(map);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });

    // const popup = new Popup().setHTML(`
    // <h6><strong>Bomberos Manta</strong></h6> 
    // <h6>Estación Central</h6> 
    //   `);

    // new Marker({ color: 'red' })
    //   .setLngLat([enviroment.LONGITUD, enviroment.LATITUD])
    //   .setPopup(popup)
    //   .addTo(map);

    // zoom
    map.addControl(new mapboxgl.NavigationControl());

    const manabiBoundingBox: [number, number, number, number] = [
      -80.8936, -1.8223, -80.3836, -0.7344,
    ];
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      bbox: manabiBoundingBox,
      countries: 'EC',
      proximity: {
        longitude: enviroment.LONGITUD_MAP,
        latitude: enviroment.LATITUD_MAP,
        // longitude: enviroment.LONGITUD,
        // latitude: enviroment.LATITUD,
      },
      autocomplete: true,
      limit: 10,
      marker: false
    });
    // search
    map.addControl(geocoder, 'top-left');

    geocoder.on('result', (event) => {
      this.datosGeolocalizacion = event.result;
      // console.log('init:', this.datosGeolocalizacion.center);
      // console.log('init:', this.datosGeolocalizacion);

      this.marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([
          this.datosGeolocalizacion.center[0], // longitud
          this.datosGeolocalizacion.center[1], // latitud
        ])
        .addTo(map);

      // // Maneja el evento de arrastre del marcador
      this.marker.on('dragend', () => {
        const newCoordinates = this.marker?.getLngLat();

        // Actualiza las coordenadas en this.coordenadasNuevas
        this.coordenadasNuevas = {
          longitude: newCoordinates.lng,
          latitude: newCoordinates.lat,
        };

        if (this.coordenadasNuevas) {
          // console.log('debe actualizar');
          (this.datosGeolocalizacion.center[1] =
            this.coordenadasNuevas.latitude),
            (this.datosGeolocalizacion.center[0] =
              this.coordenadasNuevas.longitude);
          this.reverseGeocode(newCoordinates.lng, newCoordinates.lat).subscribe(
            (result: any) => {
              if (result && result.features && result.features.length > 0) {
                // Obtiene la primera dirección encontrada
                const nuevaDireccion = result.features[0].place_name;

                // Asigna la nueva dirección a this.despacho.direccion
                this.despacho.direccion = nuevaDireccion;
                this.datosGeolocalizacion.place_name = nuevaDireccion;

                setTimeout(() => {
                  this.despacho.direccion = nuevaDireccion;
                  // console.log('nueva direccion: ', this.despacho.direccion);
                });

                // Imprime la nueva dirección en la consola
                // console.log('Nueva dirección:', this.despacho.direccion);
              } else {
                console.log(
                  'No se encontraron resultados de geocodificación inversa.'
                );
              }
            },
            (error) => {
              console.error(
                'Error en la solicitud de geocodificación inversa:',
                error
              );
            }
          );
          // (this.datosGeolocalizacion.center[1] =
          //   this.coordenadasNuevas.latitude),
          //   (this.datosGeolocalizacion.center[0] =
          //     this.coordenadasNuevas.longitude);
        }
      });

      setTimeout(() => {
        this.despacho.direccion = this.datosGeolocalizacion.place_name;
        // console.log('nuevo: ', this.despacho.direccion);
      });
    });
  }
  // basic
  // const markerEmergencias = new Popup().setHTML(`
  //   <span>dd</span> <br>
  //   `);
  // const markerEmergenciaPopup = new Marker({ color: 'orange' })
  //   .setLngLat([-80.70955667665378, -0.9624376165199626])
  //   .setPopup(markerEmergencias)
  //   .addTo(map);

  reverseGeocode(lng: number, lat: number) {
    const mapboxApiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`;
    const apiKey = enviroment.mapboxKey;

    return this.httpClient.get(mapboxApiUrl, {
      params: { access_token: apiKey },
    });
  }

  listaCodigos: CodigosJsonInterface[] = [];

  codigoPadreSeleccionado: CodigosJsonInterface = {
    codigoPadre: '',
    descripcion: '',
    hijos: [],
    nivel: '',
  };

  hijosSeleccionadosPadre: any;

  codigoHijoSeleccionado: any;

  seleccionarCodigoPadre() {
    if (this.codigoPadreSeleccionado) {
      // console.log('padre', this.codigoPadreSeleccionado);
      this.hijosSeleccionadosPadre = this.codigoPadreSeleccionado.hijos;
    }
    // console.log('hijo', this.hijosSeleccionadosPadre);
  }

  seleccionarCodigoHijo() {
    // console.log('hijo: ', this.codigoHijoSeleccionado);
    const enviar = {
      codigo: this.codigoHijoSeleccionado.codigo,
      descripcion: this.codigoHijoSeleccionado.descripcion,
      nivel: this.codigoHijoSeleccionado.nivel,
    };
    // console.log('enviar: ', enviar);
  }

  direccionGeolocalizacion: string = '';
  btn_registrar(): any {
    // this.despacho.direccion = this.datosGeolocalizacion.text
    this.loadingRegistrarEmergencia = true;
    this.formSubmitted = true;
    // console.log(this.datosGeolocalizacion.texto);

    if (
      this.despacho.direccion === '' ||
      !this.codigoHijoSeleccionado ||
      !this.hijosSeleccionadosPadre
    ) {
      this.loadingRegistrarEmergencia = false;
      return;
    }

    const datosParaEnviar = {
      direccion: this.datosGeolocalizacion.place_name,
      tipoEmergencia: `${this.codigoPadreSeleccionado.descripcion} ${this.codigoHijoSeleccionado.descripcion}`,
      codigoP: this.codigoPadreSeleccionado.codigoPadre,
      descripcionP: this.codigoPadreSeleccionado.descripcion,
      nivelP: this.codigoPadreSeleccionado.nivel,
      codigoH: this.codigoHijoSeleccionado.codigo,
      descripcionH: this.codigoHijoSeleccionado.descripcion,
      nivelH: this.codigoHijoSeleccionado.nivel,
      longitud: this.datosGeolocalizacion.center[0],
      latitud: this.datosGeolocalizacion.center[1],
      referencia: this.despacho.referencia,
      nombresRadioOperador: `${this.nombreUsuario} ${this.apellidosUsuario}`,
    } as DataRegistroEmergencia;

    // console.log('listao para enviar;??', datosParaEnviar);

    setTimeout(() => {
      this.loadingRegistrarEmergencia = false;

      Swal.fire({
        icon: 'question',
        text: '¿Está seguro de registrar la emergencia?',
        showCancelButton: true,
        confirmButtonColor: 'secondary',
        cancelButtonColor: 'info',
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.despacharService.registarEmergencia(datosParaEnviar).subscribe({
            next: async (response) => {
              await this.obtenerEmergenciasEnCurso();
              await this.iniciarMapa();
              Swal.fire({
                position: 'center',
                icon: 'success',
                text: `${response.message}`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 3500,
              });
              this.despacho.direccion = '';
              this.despacho.tipoEmergencia = '';
              (this.despacho.codigoP = ''),
                (this.despacho.nivelP = ''),
                (this.despacho.descripcionP = ''),
                (this.despacho.codigoH = ''),
                (this.despacho.descripcionH = ''),
                (this.despacho.nivelH = ''),
                (this.codigoHijoSeleccionado = ''),
                (this.codigoPadreSeleccionado = {
                  codigoPadre: '',
                  descripcion: '',
                  hijos: [],
                  nivel: '',
                });
              this.despacho.referencia = '';
              (this.despacho.latitud = 0), (this.despacho.longitud = 0);
              this.despacho.nombresRadioOperador = '';
            },
            error: (error) => {
              // console.log('error service: ', error);

              Swal.fire({
                position: 'center',
                icon: 'error',
                text: `No fue posible guardar los datos.`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2500,
              });
            },
          });

          // this.
        }
      });
    }, 500);
  }

  btnLimpiarFormulario() {
    this.loadingLimpiarFormulario = true;
    setTimeout(() => {
      this.loadingLimpiarFormulario = false;
      this.despacho = {
        direccion: '',
        tipoEmergencia: '', // descripcionP descripcionH
        codigoP: '',
        descripcionP: '',
        nivelP: '',
        codigoH: '',
        descripcionH: '',
        nivelH: '',
        longitud: 0,
        latitud: 0,
        referencia: '',
        nombresRadioOperador: '',
      };
      this.codigoPadreSeleccionado = {
        codigoPadre: '',
        descripcion: '',
        hijos: [],
        nivel: '',
      };
      this.codigoHijoSeleccionado = '';
    }, 1000);
  }

  btnListarEmergencias() {
    this.loadingListarEmergencias = true;
    setTimeout(() => {
      this.loadingListarEmergencias = false;
      this.router.navigate(['/emergencia/encurso']);
    }, 1000);
  }

  listaEmergenciasEC: any[] = [];

  async cargarInfor() {
    try {
      await this.obtenerEmergenciasEnCurso();
      await this.cargarCodigosJson();
      await this.iniciarMapa();
    } catch (error) {
      console.log(error);
    }
  }

  async obtenerEmergenciasEnCurso() {
    try {
      const response = await this.despacharService
        .obtenerEmergenciasEnCurso()
        .toPromise();
      this.listaEmergenciasEC = response.data;
    } catch (error) {
      console.log('No se pudo acceder a las emergencias', error);
    }
  }

  async cargarCodigosJson() {
    try {
      const response = await this.despacharService
        .cargarCodigosJson()
        .toPromise();
      if (response) {
        this.listaCodigos = response.codigos;
      }
    } catch (error) {
      console.log('No se pudo acceder a los códigos: ', error);
    }
  }
}
