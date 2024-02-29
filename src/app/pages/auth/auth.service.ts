import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginInterface } from '../../interfaces';
import { enviroment } from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth_url = enviroment.AUTH_URL;

  constructor(private httpClient: HttpClient) {}

  login(dataLogin: LoginInterface): Observable<any> {
    return this.httpClient.post<any>(this.auth_url + 'login', dataLogin);
  }
}
