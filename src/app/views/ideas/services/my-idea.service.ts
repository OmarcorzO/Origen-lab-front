import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MyIdeaService {
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

  armarHeaderConBody(token, body) {
    const headersObject = new HttpHeaders({
      authorization: token,
    });

    const httpOptions = {
      headers: headersObject,
      body: body
    };

    return httpOptions;
  }

  editIdea(data, token) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/editIdea`, data, httpOptions);
  }

  listMyIdea(token) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listMyIdeas`, httpOptions);
  }

  getSpecificIdea(token, ideaId) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/getIdea`, ideaId, httpOptions);
  }

  createAnexo(token, anexoObject, nameAnexo) {
    const formData = new FormData();
    
    switch (nameAnexo) {
      case 'anexoOne':
        formData.append('anexo', anexoObject.anexoOne, anexoObject.anexoOne.name)
        break;
      case 'anexoTwo':
        formData.append('anexo', anexoObject.anexoTwo, anexoObject.anexoTwo.name)
        break;
      case 'anexoThree':
        formData.append('anexo', anexoObject.anexoThree, anexoObject.anexoThree.name)
        break;
      default:
        break;
    }
    formData.append('ideaId', anexoObject.ideaId);
    formData.append('nameAnexo', nameAnexo);

    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createAnexosIdea`, formData, httpOptions);
  }

  deleteAnexo(token, anexoObject) {    
    const httpOptions = this.armarHeaderConBody(token, anexoObject);
    return this.http.delete(`${this.heroku}/deleteAnexosIdea`, httpOptions);
  }

  // Section Reactions
  listReactionType(token)  {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/typeReactionList`, httpOptions);
  }
}

