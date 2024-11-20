import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Fetch data from an API or local JSON file
  getData(): Observable<any> {
    return this.http.get('assets/data.json'); 
  }
}
