import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConformationService {
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

  createTeam(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createTeamBuilding`, data, httpOptions);
  }

  deleteTeam(token, data) {
    const httpOptions = this.armarHeader(token);
    const id = {
        ideaId: data
    }
    return this.http.put(`${this.heroku}/deleteTeamBuilding`, id, httpOptions);
  }

  listIdeaPhase(token) {
    const httpOptions = this.armarHeader(token);
    const phase = {
        phase: "teamBuilding"
    }
    return this.http.post(`${this.heroku}/getIdea/phase`, phase, httpOptions);
  }

  changePhaseIdeation(token, id) {
    const httpOptions = this.armarHeader(token);
    
    const idIdea = {
      ideaId: id
    }
    return this.http.put(`${this.heroku}/phaseOfIdeationTeamBuilding`, idIdea, httpOptions);
  }

  listStatusTeamsUser(token) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listIdeaForUserTeamBuilding`, httpOptions);
  }
}
