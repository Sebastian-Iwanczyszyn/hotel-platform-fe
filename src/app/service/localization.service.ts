import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Localization {
  id: string;
  name: string;
  address?: string;
}

export interface Pagination<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateLocalizationDto {
  name: string;
}

export interface UpdateLocalizationDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private readonly apiUrl = `${environment.API_URL}/admin/localizations`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, limit: number = 25): Observable<Pagination<Localization>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Pagination<Localization>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Localization> {
    return this.http.get<Localization>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateLocalizationDto): Observable<Localization> {
    return this.http.post<Localization>(this.apiUrl, data);
  }

  update(id: string, data: UpdateLocalizationDto): Observable<Localization> {
    return this.http.put<Localization>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
