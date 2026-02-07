import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private path = `${environment.baseUrl}`;
  //private token = `${environment.token}`;

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(
    private http: HttpClient, 
    private authService: AuthenticationService
  ) { }

  //Add comapny name
  public createCompany(companyName: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createCompany`, companyName, this.requestOptions);
  }

  /*************** SHARED GET ACTIONS ***************/
  public sendComplaint(payload: any): Observable<any> {
    return this.http.post<any>(`${this.path}/complaints`, payload, this.requestOptions);
  }

}
