import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  constructor(private http: HttpClient) { }

  public heroku = environment.serviceApi;

  //  CONFIG
  armarHeader(token) {
    const headersObject = new HttpHeaders({
      authorization: token,
    });
    const httpOptions = {
      headers: headersObject,
    };
    return httpOptions;
  }

  createIndi(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createNeedIndicator`, data, httpOptions);
  }

  updateIndi(token, data) {
    const httpOptions = this.armarHeader(token);

    return this.http.put(`${this.heroku}/updateNeedIndicator`, data, httpOptions);
  }

  listIndi(token, idNeed) {
    const httpOptions = this.armarHeader(token);
    
    return this.http.get(`${this.heroku}/listNeedIndicator/${idNeed}`, httpOptions);
  }

  disableIndi(token, data) {
    const httpOptions = this.armarHeader(token);
    const id = {
      idNeedIndicator: data._id,
      idNeed: data.idNeed
    }

    return this.http.put(`${this.heroku}/disableNeedIndicator`, id, httpOptions);
  }
}