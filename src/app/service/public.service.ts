import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Product} from './product.service';

export interface PublicWebsiteConfiguration {
  backgroundImageUrl: string;
  configuration: { title: string, subTitle: string };
}

export interface CheckAvailabilityDto {
  startFrom: string;
  endedAt: string;
}

export interface PricePerDay {
  date: string;
  price: string | null;
}

interface AvailabilityProduct {
  id: string;
  name: string;
  type: string;
  price: string;
  url: string;
}

export interface AvailabilityDto {
  product: AvailabilityProduct;
  pricePerDay: PricePerDay[];
  total: string;
}

export interface Order {
  id: string;
  customerId: string;
  bookingId: string;
  bookingPublicId: string;
  externalPaymentIdentifier: string | null;
  name: string;
  totalAmount: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonInfo {
  firstname: string;
  lastname: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  companyName: string | null;
  nip: string | null;
}

export interface CreateBookingDto {
  productId: string;
  startFrom: string;
  endedAt: string;
  personInfo: PersonInfo;
}

export interface Booking {
  id: string;
  productId: string;
  startFrom: string;
  endedAt: string;
  personInfo: PersonInfo;
}

export interface PaymentProvider {
  id: string;
  type: PaymentMethod;
  name: string;
  isActive: boolean;
}

export interface BankTransferDetails {
  orderId: string;
  iban: string;
  accountHolder: string;
  street: string;
  amount: string;
  bankName: string;
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYU = 'PAYU',
}

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private readonly apiUrl = `${environment.API_URL}/public`;
  private readonly apiUrl2 = `http://localhost:3001/api/public`;

  constructor(private http: HttpClient) {
  }

  getConfigurationById(id: string): Observable<PublicWebsiteConfiguration> {
    return this.http.get<PublicWebsiteConfiguration>(`${this.apiUrl}/website/${id}`);
  }

  getProducts(publicLocalizationId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/${publicLocalizationId}`);
  }

  checkAvailabilityForLocalization(publicLocalizationId: string, data: CheckAvailabilityDto): Observable<AvailabilityDto[]> {
    return this.http.post<AvailabilityDto[]>(`${this.apiUrl}/check-availability/localization/${publicLocalizationId}`, data);
  }

  checkAvailabilityForProduct(productId: string, data: CheckAvailabilityDto): Observable<AvailabilityDto> {
    return this.http.post<AvailabilityDto>(`${this.apiUrl}/check-availability/product/${productId}`, data);
  }

  book(data: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/book`, data);
  }

  getPaymentProviders(bookingId: string): Observable<PaymentProvider[]> {
    return this.http.get<PaymentProvider[]>(`${this.apiUrl2}/payment-providers/${bookingId}`);
  }

  getBankTransferDetails(bookingId: string): Observable<BankTransferDetails> {
    return this.http.get<BankTransferDetails>(`${this.apiUrl2}/payment-providers/${bookingId}/bank-transfer`);
  }

  getOrderByBookingId(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl2}/orders/${orderId}`);
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/booking/${bookingId}`);
  }

  updatePaymentMethod(bookingId: string, data: PaymentMethod): Observable<{ url: string }> {
    return this.http.put<{ url: string }>(`${this.apiUrl2}/orders/update-payment-method/${bookingId}`, {
      paymentProviderType: data,
    });
  }

}
