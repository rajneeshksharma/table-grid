import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  getStudents(data): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/students?page=${data.page}&perPage=${data.perPage}&search=${data.search}`);
  }
  addStudents(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/students`, data);
  }
  editStudents(data): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/students`, data);
  }
  removeStudents(id): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/students?id=${id}`);
  }
}
