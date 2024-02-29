import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ParteService } from '../parte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-completar',
  templateUrl: './completar.component.html',
})
export class CompletarComponent implements OnInit {
  loading: boolean = true;
  mostrarIndicadorCarga: boolean = true;

  // Editar parte
  loadingEditarParte: boolean = false;
  dataEnCurso!: any;
  uuidObtenido!: string;

  constructor(
    private readonly router: Router,
    private readonly parteService: ParteService
  ) {}

  ngOnInit(): void {
    this.obtenerListadoEmergencias();
  }

  async obtenerListadoEmergencias() {
    try {
      const response = await this.parteService
        .obtener_emergencias()
        .toPromise();
      setTimeout(() => {
        this.loading = false;
        this.dataEnCurso = response.data;
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
      });
    }
  }

  btn_editar_parte(uuidEmergencia: string) {
    this.uuidObtenido = uuidEmergencia;
    this.router.navigate([`/parte/completar/detalles/${this.uuidObtenido}`]);
  }
}
