import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AceerpService {

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  private path = `${environment.aceerpBaseUrl}`;

  constructor(private http: HttpClient, private authService: AuthenticationService) { }


  //Get the list of all companies
  public getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchAllCompanies`, this.requestOptions);
  }

  //Get the list of all companies
  public getCompanyDetails(companyId: string): Observable<any> {
    return this.http.get<any>(`${this.path}/companyId/${companyId}`, this.requestOptions);
  }

  //Get the list of all system modules
  public getSystemModules(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetchModules`, this.requestOptions);
  }

  //Create a new permission
  public createPermission(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createPermission`, info, this.requestOptions);
  }

  //Activate a company's subscription
  public activateSubscription(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/subscribe`, info, this.requestOptions);
  }

  //Get the subscription plans
  public getAllSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${this.path}/subscriptionPlans`, this.requestOptions);
  }

  //Get the subscription history by company id
  public getCompanySubscriptionHistory(companyId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/subscriptions/company/${companyId}`, this.requestOptions);
  }

  //Create a new role
  public createRole(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/createRole`, info, this.requestOptions);
  }

  //Update Company Permissions
  public updatePermissions(payload: any): Observable<any> {
    return this.http.patch<any>(`${this.path}/updatePermissions`, payload, this.requestOptions);
  }

}
