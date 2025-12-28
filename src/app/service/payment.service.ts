import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
}

export interface CreatePaymentProviderDto {
  type: PaymentProviderType;
  configuration: any;
}

export interface UpdatePaymentProviderDto {
  configuration?: any;
}

export interface BankTransferConfiguration {
  iban: string;
  accountHolderName: string;
  address: string;
  bankName: string | null;
}

export interface PayUConfiguration {
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

  constructor(private http: HttpClient) {}

  create<T>(dto: CreatePaymentProviderDto): Observable<PaymentProvider<T>> {
    return this.http.post<PaymentProvider<T>>(this.apiUrl, dto);
  }

  getAll(): Observable<PaymentProvider<any>[]> {
    return this.http.get<PaymentProvider<any>[]>(this.apiUrl);
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
