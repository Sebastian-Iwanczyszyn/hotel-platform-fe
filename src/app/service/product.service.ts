import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Pagination} from '../components/generic-grid.';
import {GridDeletable} from './grid-deletable';
import {Localization} from './localization.service';
import {ViewUploaded} from '../model/upload';

export interface Product {
  id: string;
  name: string;
  originalPrice: string;
  salePrice: string | null;
  localization: Localization;
  type: string;
  viewUploaded: ViewUploaded | null,
  quantity: number;
  visibility: string;
}

export enum Visibility {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

export interface CreateDto {
  name: string;
  originalPrice: string;
  salePrice: string | null;
  localizationId: string;
  productTypeId: string;
  imageId: string | null;
  quantity: number;
  visibility: string;
}

export interface UpdateDto {
  name?: string;
  originalPrice?: number;
  salePrice?: number | null;
  localizationId?: string;
  productTypeId?: string;
  imageId?: string | null;
  quantity?: number;
  visibility?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService implements GridDeletable {
  private readonly apiUrl = `${environment.API_URL}/admin/products`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, limit: number = 25): Observable<Pagination<Product>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Pagination<Product>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: string, data: UpdateDto): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
