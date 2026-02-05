import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private path = `${environment.baseUrl}`;
  private _isLoggedin$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'user_auth';
  public isLoggedIn = this._isLoggedin$.asObservable();
  user: any;

  get token() {
    return sessionStorage.getItem(this.TOKEN_NAME);
  }

  get loggedInUser() {
    if (sessionStorage.getItem('loggedInUser')) {
      return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }
    return null;
  }

  constructor(private http: HttpClient, private route: Router) {
    //Checking for login status in local storage
    this._isLoggedin$.next(!!this.token);
  }

  public signup(signupDetails: any): Observable<any> {
    return this.http.post<any>(`${this.path}/signup`, signupDetails);
  }

  public login(loginDetails: any): Observable<any> {
    //console.log(loginDetails);
    return this.http.post<any>(`${this.path}/signin`, loginDetails).pipe(
      tap((res: any) => {
        this._isLoggedin$.next(true);
        sessionStorage.setItem(this.TOKEN_NAME, res.token);
        sessionStorage.setItem('loggedInUser', JSON.stringify(res));
        //this.user = this.getUser(res.token);
      })
    );
  }

  public logout() {
    sessionStorage.removeItem(this.TOKEN_NAME);
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.clear();
    this.route.navigate(['login']);
    setTimeout(()=> {
      window.location.reload();
    }, 800)
  }

  public getUser(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  public verifyEmail(token: any): Observable<any> {
    return this.http.post<any>(`${this.path}/verifyEmail`, token);
  }

  public setPassword(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/setPassword`, info);
  }

  public forgotPassword(userEmail: any): Observable<any> {
    return this.http.post<any>(`${this.path}/forgotPassword`, userEmail);
  }

}
