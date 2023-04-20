import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NewNeedsService {
  constructor(private http: HttpClient) { }

  public heroku = environment.serviceApi;

  //  CONFIG
  armarHeader(token: string) {
    const headersObject = new HttpHeaders({
      authorization: token,
    });
    const httpOptions = {
      headers: headersObject,
    };
    return httpOptions;
  }

  createNeed(token: string, data: string) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createNeeds`, data, httpOptions);
  }

  updateNeed(token: string, data: string) {
    const httpOptions = this.armarHeader(token);

    return this.http.put(`${this.heroku}/updateNeed`, data, httpOptions);
  }

  listNeed(token: string) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listNeeds`, httpOptions);
  }

  disableNeed(token: string, data: string) {
    const httpOptions = this.armarHeader(token);
    const id = {
      idNeed: data
    }

    return this.http.put(`${this.heroku}/disableNeed`, id, httpOptions);
  }
}
