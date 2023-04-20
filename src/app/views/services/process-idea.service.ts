import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProccessIdeaService {
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

  getProcessIdea(token, ideaId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/processOfIdea/${ideaId}`, httpOptions);
  }
}
