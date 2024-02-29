import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { resolve } from 'chart.js/dist/helpers/helpers.options';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public useLocation?: [number, number];

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor(private readonly httpClient: HttpClient) {
    this.getUserLocations();
  }

  public async getUserLocations(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [coords.longitude, coords.latitude];
        },
        (err) => {
          // alert('No se pudo obtener la geolocalización');
          console.log(err);
          reject();
        }
      );
    });
  }
}
