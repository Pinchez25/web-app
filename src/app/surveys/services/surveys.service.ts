import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurveysService {
  constructor(private http: HttpClient) {}

  getSurveys(): Observable<any> {
    return this.http.get('/surveys');
  }

  getSurvey(surveyId: number): Observable<any> {
    return this.http.get(`/surveys/${surveyId}`);
  }

  getSurveyAnalytics(surveyName: string): Observable<any> {
    return this.http.get(`/surveys/analytics/${surveyName}/responses`);
  }
}
