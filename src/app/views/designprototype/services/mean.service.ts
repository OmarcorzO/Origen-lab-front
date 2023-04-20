import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MeanService {

  constructor(private http: HttpClient) { }

  public heroku = environment.serviceApi;

  // CONFIG
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

  // Crud Mean
  createMean(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createMean`, data, httpOptions);
  }

  changeStateMean(token, data) {
    const httpOptions = this.armarHeader(token);
    
    return this.http.put(`${this.heroku}/changeStatus`, data, httpOptions);
  }

  getMean(token, ideaId, acitivityId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listMean?ideaId=${ideaId}&activityId=${acitivityId}`, httpOptions); 
  }

  // Crud Responsables
  assignMean(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/assignMean`, data, httpOptions);
  }

  removeResponsabilityMean(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/removeResponsibilityMean`, data, httpOptions);
  }

  getResponsabilityMean(token, id, meanId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listResponsibleMean?ideaId=${id}&meanId=${meanId}`, httpOptions); 
  }

  // Crud Evidencias
  createEvidenceMean(token, credentials) {
    const formData = new FormData();
    for (let propname in credentials) {
      if (propname === 'evidence') {
        formData.append(`${propname}`, credentials[propname], `${credentials[propname].name}`); 
      } else {
        formData.append(`${propname}`, `${credentials[propname]}`); 
      }
    }
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createEvidenceMeanActivity`, formData, httpOptions);
  }

  changeStatusEvidenceMeanActivity(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/chageStatusEvidenceMeanActivity`, data, httpOptions);
  }

  getEvidence(token, id, meanId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getEvidenceOfMeanActivity?ideaId=${id}&meanId=${meanId}`, httpOptions); 
  }
}
