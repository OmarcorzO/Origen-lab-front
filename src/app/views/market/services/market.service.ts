import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

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

  // Market
  createMarket(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createMarket`, data, httpOptions);
  }

  updateMarket(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateMarket`, data, httpOptions);
  }

  getMarket(token, ideaId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/getMarket/${ideaId}`, httpOptions);
  }

  // Market Challenge
  createMarketChallenge(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/createMarketChallenge`, data, httpOptions);
  }

  updateMarketChallange(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/updateMarketChallange`, data, httpOptions);
  }

  getMarketChallenge(token, ideaId, marketId) {
    const httpOptions = this.armarHeader(token);
    return this.http.get(`${this.heroku}/listMarketChallenges/${ideaId}/${marketId}`, httpOptions);
  }

  disableMarketChallange(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/disableMarketChallange`, data, httpOptions);
  }

  finalizedMarketChallange(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/finalizedMarketChallange`, data, httpOptions);
  }

  // Evidence
  updateEvidenceMarketChallenge(token, credentials) {
    const formData = new FormData();
    for (let propname in credentials) {
      if (propname === 'evidence') {
        formData.append(`${propname}`, credentials[propname], `${credentials[propname].name}`); 
      } else {
        formData.append(`${propname}`, `${credentials[propname]}`); 
      }
    }
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/upEvidenceMarketChallange`, formData, httpOptions);
  }

  deleteEvidenceMarketChallenge(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.put(`${this.heroku}/deleteEvidenceMarketChallange`, data, httpOptions);
  }

  // Idea
  finalizedIdea(token, data) {
    const httpOptions = this.armarHeader(token);
    return this.http.post(`${this.heroku}/finalizedIdea`, data, httpOptions);
  }
}
