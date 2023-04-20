import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

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

  changePhaseMarketing(token, id) {
    const httpOptions = this.armarHeader(token);
    
    const idIdea = {
      ideaId: id
    }
    return this.http.put(`${this.heroku}/goToPhaseMarketing`, idIdea, httpOptions);
  }

  // Crud Activitie
  createActivity(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createActivity`, data, httpOptions);
  }

  updateActivity(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateActivity`, data, httpOptions);
  }

  getActivity(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listActivity?ideaId=${id}`, httpOptions); 
  }

  endActivity(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/endActivity`, data, httpOptions);
  }

  changeStatusActivity(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/changeActivity`, data, httpOptions);
  }

  listTeamBuilding(token, id) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listTeamBuilding?ideaId=${id}`, httpOptions); 
  }

  // Gestión Responsables
  assignResponsibility(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/assignActivity`, data, httpOptions);
  }

  removeResponsibility(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/removeResponsibilityActivity`, data, httpOptions);
  }

  getResponsibles(token, ideaId, activityId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listResponsibleActivity?ideaId=${ideaId}&activityId=${activityId}`, httpOptions); 
  }

  // Gestión Evidencias
  uploadEvidence(token, credentials) {
    const formData = new FormData();
    for (let propname in credentials) {
      if (propname === 'evidence') {
        formData.append(`${propname}`, credentials[propname], `${credentials[propname].name}`); 
      } else {
        formData.append(`${propname}`, `${credentials[propname]}`); 
      }
    }
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/uploadEvidenceOfActivity`, formData, httpOptions);
  }

  getEvidence(token, ideaId, activityId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getEvidenceActivity?ideaId=${ideaId}&activityId=${activityId}`, httpOptions); 
  }

  changeStatusEvidence(token, data) { 
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/chageStatusEvidenceActivity`, data, httpOptions);
  }
}
