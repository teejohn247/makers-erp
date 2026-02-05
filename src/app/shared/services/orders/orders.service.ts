import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../utils/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private path = `${environment.baseUrl}`;
  //private token = `${environment.token}`;

  headerParams = {
    'Authorization': this.authService.token
  }
  requestOptions = {                                                                                                                                                                                 
    headers: new HttpHeaders(this.headerParams)
  }

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  /*************** CUSTOMER RELATED ACTIONS ***************/

  //Create a new customer
  public createCustomer(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-customer`, info, this.requestOptions);
  }

  //Get the list of all customers
  public getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-customers`, this.requestOptions);
  }

  //Get details of a customer
  public getCustomer(customerId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-customer/${customerId}`, this.requestOptions);
  }

  //Delete customer
  public deleteCustomer(customerId: any): Observable<any> {
    return this.http.delete<any>(`${this.path}/delete-customer/${customerId}`, this.requestOptions);
  }

  /*************** PRODUCT RELATED ACTIONS ***************/

  //Create a new product
  public createProduct(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-product`, info, this.requestOptions);
  }

  //Get the list of all products
  public getProducts(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-products`, this.requestOptions);
  }

  //Get product details
  public getProductDetails(productId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-product/${productId}`, this.requestOptions);
  }

  //Create a new product stock
  public createStock(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-stock`, info, this.requestOptions);
  }

  //Get stock history
  public getStockHistory(productId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-stocks?productId=${productId}`, this.requestOptions);
  }

  //Create a new product category
  public createProductCategory(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-product-cat`, info, this.requestOptions);
  }

  //Get the list of all product categories
  public getProductCategories(): Observable<any> {
    return this.http.get<any>(`${this.path}/get-product-cats`, this.requestOptions);
  }

  /*************** SUPPLIER RELATED ACTIONS ***************/

  //Create a new supplier
  public createSupplier(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-supplier`, info, this.requestOptions);
  }

  //Get the list of all suppliers
  public getSuppliers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-suppliers`, this.requestOptions);
  }

  //Get details of a supplier
  public getSupplier(supplierId:string): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-supplier/${supplierId}`, this.requestOptions);
  }

  /*************** COURIER RELATED ACTIONS ***************/

  //Create a new freight carrier
  public createCourier(info: any): Observable<any> {
    return this.http.post<any>(`${this.path}/create-courier`, info, this.requestOptions);
  }

  //Get the list of all couriers
  public getCouriers(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-couriers`, this.requestOptions);
  }

  /*************** GENERAL RELATED ACTIONS ***************/

  //Get the list of all industries
  public getIndustries(): Observable<any> {
    return this.http.get<any>(`${this.path}/fetch-industries`, this.requestOptions);
  }
}
