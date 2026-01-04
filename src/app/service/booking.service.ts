import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagination } from '../components/generic-grid.';
import { GridDeletable } from './grid-deletable';

export interface Booking {
  id: string;
  state: BookingState;
}

export enum BookingState {
  RESERVED = 'RESERVED',
  BOOKED = 'BOOKED',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED',
}

@Injectable({
  providedIn: 'root',
})
export class BookingService implements GridDeletable {
  private readonly apiUrl = `${environment.API_URL}/admin/bookings`;

  constructor(private http: HttpClient) {}

  list(page: number = 1, limit: number = 25, search?: string): Observable<Pagination<Booking>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Pagination<Booking>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  exportBookings(): Observable<string> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'text' });
  }
}
