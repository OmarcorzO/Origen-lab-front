import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
    
  }

  public heroku = environment.serviceApi;

  registerUser(credentials: any) {
    return this.http.post(`${this.heroku}/registerUser`, credentials);
  }

  loginUser(credentials: any) {
    return this.http.post(`${this.heroku}/login`, credentials);
  }

  registerProfile(credentials: any, token: any) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/registerProfile`, credentials, httpOptions);
  }

  updateProfile(credentials: any, token: any) {
    const formData = new FormData();    

    for (var propname in credentials) {
      
      if(propname === 'password') {
        formData.append('password', `${credentials[propname]}`);
      } else if (propname === 'img'){
        if (credentials[propname] !== "") {
          formData.append(`${propname}`, credentials[propname],`${credentials[propname].name}`);
        }
      } else if (propname === 'imgCloud'){
        formData.append('profile[img]', `${credentials[propname]}`);
      } else {
        formData.append(`profile[${propname}]`, `${credentials[propname]}`);
      }
    }

    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/editUser`, formData, httpOptions);
  }

  getProfile(token: any) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getProfile`, httpOptions);
  }

  rolList(token: any) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/rolList?numerPage=1&sizepage=5&is_active=true`, httpOptions);
  }

  armarHeader(token: any) {
    const headersObject = new HttpHeaders({
      authorization: token,
    });

    const httpOptions = {
      headers: headersObject,
    };

    return httpOptions;
  }
}
