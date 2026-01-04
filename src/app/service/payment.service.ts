import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {Order} from '../model/payment-service';
import {Pagination} from '../components/generic-grid.';

export enum PaymentProviderType {
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYU = 'PAYU',
  TPAY = 'TPAY',
  PAYPAL = 'PAYPAL',
}

export interface PaymentProvider<T> {
  id: string;
  type: PaymentProviderType;
  configuration: T;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface CreatePaymentProviderDto {
  type: PaymentProviderType;
  configuration: any;
}

export interface UpdatePaymentProviderDto {
  configuration?: any;
}

export interface Configuration {
  id: string | null;
}

export interface BankTransferConfiguration extends Configuration {
  iban: string;
  accountHolderName: string;
  address: string;
  bankName: string | null;
}

export interface PayUConfiguration extends Configuration {
  merchant_pos_id: string;
  client_id: string;
  client_secret: string;
  second_key: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  // private readonly apiUrl = `${environment.API_URL}/admin/payment-providers`;
  private readonly apiUrl = `http://localhost:3001/api/admin/payment-providers`;
  private readonly apiOrderUrl = `http://localhost:3001/api/admin/orders`;

  constructor(private http: HttpClient) {}

  create<T>(dto: CreatePaymentProviderDto): Observable<PaymentProvider<T>> {
    return this.http.post<PaymentProvider<T>>(this.apiUrl, dto);
  }

  list(page: number = 1, limit: number = 25): Observable<Pagination<Order>> {
    return this.http.get<Pagination<Order>>(`${this.apiOrderUrl}?page=${page}&limit=${limit}`);
  }

  getById<T>(id: string): Observable<PaymentProvider<T>> {
    return this.http.get<PaymentProvider<T>>(`${this.apiUrl}/${id}`);
  }

  getByType<T>(type: PaymentProviderType): Observable<PaymentProvider<T>> {
    return this.http.get<PaymentProvider<T>>(`${this.apiUrl}/type/${type}`);
  }

  update<T>(id: string, dto: UpdatePaymentProviderDto): Observable<PaymentProvider<T>> {
    return this.http.put<PaymentProvider<T>>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
