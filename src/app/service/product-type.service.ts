import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Pagination} from '../components/generic-grid.';
import {GridDeletable} from './grid-deletable';

export interface ProductType {
  id: string;
  name: string;
}

export interface CreateDto {
  name: string;
}

export interface UpdateDto {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductTypeService implements GridDeletable {
  private readonly apiUrl = `${environment.API_URL}/admin/product-types`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, limit: number = 25): Observable<Pagination<ProductType>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Pagination<ProductType>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateDto): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, data);
  }

  update(id: string, data: UpdateDto): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
