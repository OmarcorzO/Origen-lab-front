import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NewIdeaService {

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

  createIdea(credentials, token) {
    const formData = new FormData();
    // console.log(credentials);
    for (let propname in credentials) {
      if (propname === 'anexoOne' || propname === 'anexoTwo' || propname === 'anexoThree' ) {
        formData.append(`${propname}`, credentials[propname], `${credentials[propname].name}`); 
      } else {
        formData.append(`${propname}`, `${credentials[propname]}`);  
      }
    }
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createIdea`, formData, httpOptions);
  }
}
