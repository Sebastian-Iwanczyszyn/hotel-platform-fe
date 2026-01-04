import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {BankTransferDetails, PublicService} from '../../service/public.service';
import {MaterialModule} from '../../module/material.module';

@Component({
  standalone: true,
  selector: 'public-booking-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  template: `
    <div class="container">
      @if (bankTransferDetails()) {
        <mat-card class="transfer-card">
          <mat-card-header>
            <mat-card-title>Szczegóły przelewu bankowego</mat-card-title>
            <mat-card-subtitle>ID zamówienia: {{ bankTransferDetails()?.orderId }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="details-grid">
              <div class="detail-item">
                <mat-icon>account_balance</mat-icon>
                <div class="detail-content">
                  <span class="label">Nazwa banku</span>
                  <span class="value">{{ bankTransferDetails()?.bankName }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>credit_card</mat-icon>
                <div class="detail-content">
                  <span class="label">Numer IBAN</span>
                  <span class="value">{{ bankTransferDetails()?.iban }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>person</mat-icon>
                <div class="detail-content">
                  <span class="label">Właściciel konta</span>
                  <span class="value">{{ bankTransferDetails()?.accountHolder }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>location_on</mat-icon>
                <div class="detail-content">
                  <span class="label">Adres</span>
                  <span class="value">{{ bankTransferDetails()?.street }}</span>
                </div>
              </div>

              <div class="detail-item">
                <mat-icon>note</mat-icon>
                <div class="detail-content">
                  <span class="label">Tytuł przelewu</span>
                  <span class="value">{{ bankTransferDetails()?.orderId }}</span>
                </div>
              </div>

              <div class="detail-item amount-item">
                <mat-icon>payments</mat-icon>
                <div class="detail-content">
                  <span class="label">Kwota do zapłaty</span>
                  <span class="value amount">{{ bankTransferDetails()?.amount }}</span>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-spinner diameter="50"></mat-spinner>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .transfer-card {
      width: 100%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      margin-bottom: 1.5rem;
    }

    .details-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .detail-item:hover {
      background: #eeeeee;
    }

    .detail-item mat-icon {
      color: #1976d2;
      margin-top: 0.25rem;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .label {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .value {
      font-size: 1rem;
      color: #333;
      word-break: break-all;
    }

    .amount-item {
      background: #e3f2fd;
      border: 2px solid #1976d2;
    }

    .amount-item mat-icon {
      color: #1976d2;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
    }

    @media (max-width: 600px) {
      .container {
        margin: 1rem auto;
        padding: 0.5rem;
      }
    }
  `]
})
export class PublicPaymentProcessPage implements OnInit {
  bankTransferDetails = signal<BankTransferDetails | null>(null);

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly publicService: PublicService,
  ) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      const bookingId = params['bookingId'];

      this.publicService.getBankTransferDetails(bookingId).subscribe(response => {
        this.bankTransferDetails.set(response);
      });
    });
  }
}
