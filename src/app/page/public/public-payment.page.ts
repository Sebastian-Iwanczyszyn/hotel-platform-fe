import {Component, computed, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

import {Booking, PaymentMethod, PublicService} from '../../service/public.service';
import {MaterialModule} from '../../module/material.module';
import {Order} from '../../model/payment-service';

type PaymentProvider = { type: PaymentMethod };

@Component({
  standalone: true,
  selector: 'public-booking-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  template: `
    <div class="page">
      <div class="container py-3 py-md-4">
        <div class="row g-4 mt-2">
          <!-- LEFT: payment tiles -->
          <div class="col-12 col-lg-8">
            <h2 class="title">Sfinalizuj rezerwację</h2>
            <p class="subtitle mt-5">Wybierz bezpieczną metodę płatności, aby potwierdzić pobyt.</p>

            <div class="pay-methods" [class.single]="availableTabs().length === 1">
              @for (t of availableTabs(); track t) {
                <button
                  type="button"
                  class="pay-tile"
                  [class.selected]="selectedProvider() === t"
                  (click)="selectProvider(t)"
                  [attr.aria-pressed]="selectedProvider() === t"
                >
                  <div class="tile-left">
                    <div class="tile-ic">
                      <mat-icon>{{ tabIcon(t) }}</mat-icon>
                    </div>

                    <div class="tile-text">
                      <div class="tile-title">{{ tabName(t) }}</div>
                      <div class="tile-sub">{{ tabSub(t) }}</div>
                    </div>
                  </div>

                  @if (selectedProvider() === t) {
                    <mat-icon class="tile-check">check_circle</mat-icon>
                  }
                </button>
              }
            </div>

            <div class="selected-hint" *ngIf="selectedProvider() as sp">
              Wybrana metoda: <strong>{{ tabName(sp) }}</strong>
            </div>
          </div>

          <!-- RIGHT: summary + pay button -->
          <div class="col-12 col-lg-4">
            <mat-card class="summary-card">
              <div class="summary-body">
                <div class="hotel">Nocleg</div>

                <div class="dates">
                  <div class="dcol">
                    <div class="dhead">ZAMELDOWANIE</div>
                    <div class="dval">{{ booking()?.startFrom | date:'d MMM y' }}</div>
                  </div>
                  <div class="dcol">
                    <div class="dhead">WYMELDOWANIE</div>
                    <div class="dval">{{ booking()?.endedAt | date:'d MMM y' }}</div>
                  </div>
                </div>

                <mat-divider class="my-2"></mat-divider>

                <div class="grand">
                  <div class="glabel">Suma całkowita</div>
                  <div class="gval">{{ order()?.totalAmount }} zł</div>
                  <div class="gsub">Zawiera podatek VAT</div>
                </div>
              </div>
            </mat-card>

            <button (click)="submit()" mat-flat-button color="primary" class="pay-btn" [disabled]="payDisabled()">
              Zapłać {{ order()?.totalAmount }} zł
              <mat-icon class="ms-2">arrow_forward</mat-icon>
            </button>

            <div class="ssl">
              <mat-icon>lock</mat-icon>
              <span>Płatność zabezpieczona SSL</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: `
    .page {
      background: #ffffff;
      min-height: 100vh;
    }

    .step {
      font-weight: 800;
      color: #111;
    }

    .stage {
      color: rgba(17, 17, 17, .55);
      font-weight: 700;
    }

    .progress {
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
    }

    .title {
      margin: 18px 0 6px 0;
      font-size: 44px;
      font-weight: 900;
      letter-spacing: -0.8px;
      color: #111;
    }

    .subtitle {
      margin: 0 0 16px 0;
      color: rgba(17, 17, 17, .6);
      font-size: 16px;
    }

    /* Payment tiles */
    .pay-methods {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 14px;
    }

    .pay-methods.single {
      grid-template-columns: 1fr;
    }

    .pay-tile {
      width: 100%;
      text-align: left;
      border: 1px solid rgba(17, 17, 17, .10);
      background: #fff;
      border-radius: 14px;
      padding: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 10px 22px rgba(0, 0, 0, .06);
      transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
      cursor: pointer;
    }

    .pay-tile:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(0, 0, 0, .08);
    }

    .pay-tile.selected {
      border-color: rgba(25, 118, 210, .55);
      background: rgba(25, 118, 210, .06);
      box-shadow: 0 16px 30px rgba(25, 118, 210, .14);
    }

    .tile-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .tile-ic {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(17, 17, 17, .04);
    }

    .pay-tile.selected .tile-ic {
      background: rgba(25, 118, 210, .12);
      color: #1976d2;
    }

    .tile-text {
      min-width: 0;
    }

    .tile-title {
      font-weight: 900;
      color: #111;
      font-size: 14px;
      line-height: 1.2;
    }

    .tile-sub {
      margin-top: 4px;
      font-size: 12px;
      color: rgba(17, 17, 17, .55);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tile-check {
      color: #1976d2;
      font-size: 22px;
      width: 22px;
      height: 22px;
      flex: 0 0 auto;
    }

    .selected-hint {
      margin-top: 12px;
      color: rgba(17, 17, 17, .65);
      font-size: 13px;
    }

    /* Summary */
    .summary-card {
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 12px 26px rgba(0, 0, 0, .10);
      border: 1px solid rgba(17, 17, 17, .08);
    }

    .summary-body {
      padding: 14px 16px 16px 16px;
    }

    .hotel {
      font-size: 20px;
      font-weight: 900;
      color: #111;
    }

    .dates {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .dhead {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(17, 17, 17, .55);
    }

    .dval {
      font-weight: 900;
      color: #111;
      margin-top: 4px;
    }

    .grand {
      margin-top: 8px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
    }

    .glabel {
      font-weight: 900;
      color: #111;
    }

    .gval {
      font-size: 30px;
      font-weight: 900;
      color: #1976d2;
      letter-spacing: -0.4px;
    }

    .gsub {
      font-size: 12px;
      color: rgba(17, 17, 17, .55);
    }

    .pay-btn {
      width: 100%;
      height: 56px;
      margin-top: 14px;
      border-radius: 14px;
      font-weight: 900;
      text-transform: none;
      box-shadow: 0 14px 26px rgba(25, 118, 210, .26);
    }

    .ssl {
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: rgba(17, 17, 17, .55);
      font-weight: 700;
      font-size: 13px;
    }

    .ssl mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    @media (max-width: 991px) {
      .title {
        font-size: 34px;
      }
      .pay-methods {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PublicPaymentPage implements OnInit {
  bookingId: string | undefined;
  providers = signal<PaymentProvider[]>([]);
  loading = signal(false);

  order = signal<Order | undefined>(undefined);
  booking = signal<Booking | undefined>(undefined);

  selectedProvider = signal<PaymentMethod>(PaymentMethod.BANK_TRANSFER);

  availableTabs = computed<PaymentMethod[]>(() => {
    const set = new Set(this.providers().map(p => p.type));
    if (set.size === 0) return [PaymentMethod.BANK_TRANSFER];
    return Array.from(set);
  });

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly publicService: PublicService,
  ) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      const bookingId = params['bookingId'];
      this.bookingId = bookingId;
      this.loading.set(true);

      this.publicService.getPaymentProviders(bookingId).subscribe({
        next: (response: any) => {
          const providers = response as PaymentProvider[];
          this.providers.set(providers);

          // auto-select first provider returned by BE
          const first = (providers?.[0]?.type ?? PaymentMethod.BANK_TRANSFER) as PaymentMethod;
          this.selectedProvider.set(first);
        },
        error: () => {
          this.providers.set([]);
          this.selectedProvider.set(PaymentMethod.BANK_TRANSFER);
        },
        complete: () => this.loading.set(false),
      });

      this.publicService.getOrderByBookingId(bookingId).subscribe(response => {
        this.order.set(response);
      });

      this.publicService.getBookingById(bookingId).subscribe(response => {
        this.booking.set(response);
      });
    });
  }

  selectProvider(t: PaymentMethod) {
    this.selectedProvider.set(t);
  }

  tabName(t: PaymentMethod) {
    switch (t) {
      case PaymentMethod.PAYU:
        return 'PayU';
      case PaymentMethod.BANK_TRANSFER:
        return 'Przelew tradycyjny';
    }
  }

  tabSub(t: PaymentMethod) {
    switch (t) {
      case PaymentMethod.PAYU:
        return 'Bezpieczne przekierowanie';
      case PaymentMethod.BANK_TRANSFER:
        return 'Dane do przelewu po potwierdzeniu';
    }
  }

  tabIcon(t: PaymentMethod) {
    switch (t) {
      case PaymentMethod.BANK_TRANSFER:
        return 'account_balance';
      case PaymentMethod.PAYU:
        return 'account_balance';
    }
  }

  payDisabled() {
    // Disable if nothing selected or order not loaded (optional)
    return !this.selectedProvider() || !this.order();
  }

  submit() {
    if (!this.bookingId) return;

    if (!this.selectedProvider()) {
      return;
    }

    this.publicService.updatePaymentMethod(this.bookingId, this.selectedProvider()).subscribe(response => {
      this.router.navigate([response.url]);
    })
  }
}
