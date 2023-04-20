import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IdeationService {
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

  listStatusTeamsUser(token) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listIdeaForUserTeamBuilding`, httpOptions);
  }

  changePhaseDesignPrototype(token, id) {
    const httpOptions = this.armarHeader(token);
    
    const idIdea = {
      ideaId: id
    }
    return this.http.put(`${this.heroku}/moveOnToDesignAndPrototyping`, idIdea, httpOptions);
  }

  // Crud Link de Meet
  createTeamMeeting(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createMeetingLink`, data, httpOptions);
  }

  updateTeamMeeting(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateTeamMeetingLink`, data, httpOptions);
  }

  getTeamMeeting(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getTeamMeetingLink?ideaId=${id}`, httpOptions); 
  }

  // Descripción del proyecto
  createDescription(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createTeamDescription`, data, httpOptions);
  }

  updateDescription(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateTeamDescription`, data, httpOptions);
  }

  getDescription(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getTeamDesciption?ideaId=${id}`, httpOptions); 
  }

  // Aportes Coocreación
  getContributionsOfIdea(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getContributionsOfIdea?ideaId=${id}`, httpOptions); 
  }

  // Aportes Cuadrihélice
  getTeamsContributions(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getTeamContributions?ideaId=${id}`, httpOptions); 
  }

  createTeamContribution(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createTeamContribution`, data, httpOptions);
  }

  updateTeamContribution(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateTeamContribution`, data, httpOptions);
  }
}
