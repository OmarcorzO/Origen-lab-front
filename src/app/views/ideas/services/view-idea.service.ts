import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ViewIdeaService {
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

  // Section Ideas
  getSpecificIdea(token, ideaId) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/getIdea`, ideaId, httpOptions);
  }

  listPublicIdea(token, sizePage, order) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listPublicIdeas?numberPage=1&sizePage=${sizePage}&orderType=${order}`, httpOptions);
  }

  listIdeaByField(token, sizePage, order, field) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listPublicIdeas?numberPage=1&sizePage=${sizePage}&orderType=${order}&sortByField=${field}`, httpOptions);
  }

  // Section Coments
  listCommentType(token, order) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/commentTypeList?numberPage=1&orderType=${order}`, httpOptions);  
  }

  commentIdea(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/commentIdea`, data, httpOptions);
  }

  // Section Reactions
  listReactionType(token)  {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/typeReactionList`, httpOptions);
  }

  getMyReactionIdea(token, idIdea) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getReactionIdea/${idIdea}`, httpOptions);
  }

  // **** Create, Put, Delete ****
  createReactingIdeas(token, object) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createReactingIdeas`, object, httpOptions);
  }

  putReactingIdeas(token, object){
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/editReactingIdeas`, object, httpOptions);
  }

  deleteReactingIdeas(token, object){
    const httpOptions = this.armarHeaderConBody(token, object);
    return this.http.delete(`${this.heroku}/deleteReactingIdeas`, httpOptions);
  }
}