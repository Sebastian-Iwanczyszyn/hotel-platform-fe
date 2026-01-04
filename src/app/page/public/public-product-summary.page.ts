import {Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {PricePerDay, PublicService} from '../../service/public.service';
import {MaterialModule} from '../../module/material.module';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

type Amenity = { icon: string; label: string };

@Component({
  standalone: true,
  selector: 'public-product-summary-page',
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="page">
      <div class="container py-3 py-md-4">

        <!--        &lt;!&ndash; Breadcrumb &ndash;&gt;-->
        <!--        <div class="breadcrumb-row mb-2">-->
        <!--          <span class="crumb">Strona główna</span>-->
        <!--          <span class="sep">/</span>-->
        <!--          <span class="crumb">Pokoje</span>-->
        <!--          <span class="sep">/</span>-->
        <!--          <span class="crumb active">{{ title() }}</span>-->
        <!--        </div>-->

        <!-- Header -->
        <div class="row align-items-start g-4">
          <div class="col-12 col-sm-8">
            <h1 class="h-title">{{ title() }}</h1>

            <div class="meta my-3">

              <span class="dot">•</span>
              <mat-icon class="pin">place</mat-icon>
              <span class="muted">{{ location() }}</span>
            </div>


          </div>
        </div>
        <!-- Content sections -->
        <div class="row align-items-start g-4 mt-2">
          <div class="col-12 col-sm-8">
            <!-- Gallery -->
            <div class="gallery mt-3">
              <div class="g-main" [style.background-image]="'url(' + image() + ')'"></div>

              <!--              <div class="g-side">-->
              <!--                <div class="g-tile" [style.background-image]="'url(' + images()[1] + ')'"></div>-->
              <!--                <div class="g-tile" [style.background-image]="'url(' + images()[2] + ')'"></div>-->
              <!--                <div class="g-tile" [style.background-image]="'url(' + images()[3] + ')'"></div>-->
              <!--              </div>-->
            </div>

            <mat-card class="content-card">
              <div class="card-title">Opis</div>
              <p class="desc">
                Ciesz się luksusem w naszym przestronnym Apartamencie Królewskim. Ten wyjątkowy pokój
                o powierzchni 45m² oferuje zapierający dech w piersiach widok na Zatokę Gdańską.
                Wnętrze zostało zaprojektowane z myślą o najwyższym komforcie, łącząc nowoczesny
                design z elementami klasycznej elegancji.
              </p>

              <!--              <div class="card-title mt-3">Udogodnienia</div>-->
              <!--              <div class="amenities">-->
              <!--                <div class="amenity" *ngFor="let a of amenities()">-->
              <!--                  <mat-icon>{{ a.icon }}</mat-icon>-->
              <!--                  <span>{{ a.label }}</span>-->
              <!--                </div>-->
              <!--              </div>-->
            </mat-card>

            <mat-card class="content-card mt-4">
              <div class="card-title">Szczegóły cenowe</div>

              <table mat-table [dataSource]="priceRows()" class="price-table">

                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let r">{{ r.date }}</td>
                </ng-container>

                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef class="text-end">Cena za noc</th>
                  <td mat-cell *matCellDef="let r" class="text-end price-cell">
                    {{ r.price }} PLN
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </mat-card>

          </div>
          <div class="col-12 col-sm-4">
            <mat-card class="book-card">
              <div class="price-top">
                <div class="price">
                  <span class="p-val">{{ pricePerNight() }}</span>
                  <span class="p-curr">PLN</span>
                  <span class="p-suf">/ noc</span>
                </div>
              </div>

              <mat-divider></mat-divider>

              <div class="section">
                <div class="sec-title">DATA POBYTU</div>
                <div class="dates-box">
                  <div class="date-item">
                    <div class="date-label">Zameldowanie</div>
                    <div class="date-val">{{ checkIn() }}</div>
                  </div>
                  <div class="date-item">
                    <div class="date-label">Wymeldowanie</div>
                    <div class="date-val">{{ checkOut() }}</div>
                  </div>
                </div>
              </div>

              <div class="section">

                <mat-divider class="my-2"></mat-divider>

                <div class="total">
                  <span>Razem</span>
                  <span class="t-val">{{ total() }} PLN</span>
                </div>
              </div>

              <div class="section">
                <div class="booking-form">
                  <div class="sec-title mb-3">DANE DO REZERWACJI</div>
                  <form [formGroup]="bookingForm" (submit)="book()">
                    <div class="row">
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Imię</mat-label>
                          <input matInput formControlName="firstname"/>
                          <mat-error *ngIf="bookingForm.get('firstname')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Nazwisko</mat-label>
                          <input matInput formControlName="lastname"/>
                          <mat-error *ngIf="bookingForm.get('lastname')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Email</mat-label>
                          <input matInput type="email" formControlName="email"/>
                          <mat-error *ngIf="bookingForm.get('email')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                          <mat-error *ngIf="bookingForm.get('email')?.hasError('email')">
                            Nieprawidłowy email
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Telefon</mat-label>
                          <input matInput formControlName="phone"/>
                          <mat-error *ngIf="bookingForm.get('phone')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Miasto</mat-label>
                          <input matInput formControlName="city"/>
                          <mat-error *ngIf="bookingForm.get('city')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Adres</mat-label>
                          <input matInput formControlName="address"/>
                          <mat-error *ngIf="bookingForm.get('address')?.hasError('required')">
                            Pole wymagane
                          </mat-error>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>Nazwa firmy (opcjonalnie)</mat-label>
                          <input matInput formControlName="companyName"/>
                        </mat-form-field>
                      </div>
                      <div class="col-12">
                        <mat-form-field appearance="outline">
                          <mat-label>NIP (opcjonalnie)</mat-label>
                          <input matInput formControlName="nip"/>
                        </mat-form-field>
                      </div>
                    </div>

                    <button mat-flat-button color="primary" class="reserve-btn w-75">
                      Rezerwuj Teraz
                      <mat-icon class="ms-2">arrow_forward</mat-icon>
                    </button>

                    <div class="fineprint">Nie obciążymy Cię jeszcze opłatą</div>
                  </form>
                </div>
              </div>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .page{ background: #f6f7f9; min-height: 100vh; }
    .breadcrumb-row{ font-size: 12px; color: rgba(17,17,17,.55); }
    .crumb{ cursor: default; }
    .crumb.active{ color: rgba(17,17,17,.8); font-weight: 700; }
    .sep{ margin: 0 8px; opacity: .6; }

    .h-title{
      margin: 0;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.4px;
      color: #111;
    }

    .meta{
      margin-top: 6px;
      display:flex;
      align-items:center;
      gap: 10px;
      color: rgba(17,17,17,.60);
      font-size: 13px;
    }
    .rating{
      display:flex; align-items:center; gap: 6px;
      color: #111; font-weight: 800;
    }
    .star{ font-size: 18px; width: 18px; height: 18px; color: #1e8e3e; }
    .pin{ font-size: 16px; width: 16px; height: 16px; opacity: .75; }
    .dot{ opacity: .55; }
    .muted{ color: rgba(17,17,17,.60); }

    /* Gallery */
    .g-main{
      border-radius: 14px;
      min-height: 330px;
      background-size: cover;
      background-position: center;
      box-shadow: 0 10px 22px rgba(0,0,0,.08);
    }
    .g-side{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .g-tile{
      border-radius: 14px;
      min-height: 158px;
      background-size: cover;
      background-position: center;
      box-shadow: 0 10px 22px rgba(0,0,0,.08);
      position: relative;
      overflow: hidden;
    }
    .g-tile.more::after{
      content:'';
      position:absolute; inset:0;
      background: rgba(0,0,0,.25);
    }
    .more-btn{
      position:absolute;
      left: 12px;
      bottom: 12px;
      z-index: 1;
      border-radius: 999px;
      background: rgba(255,255,255,.92);
      border-color: rgba(255,255,255,.92);
      font-weight: 800;
    }

    /* Booking card */
    .book-card{
      position: sticky;
      top: 88px; /* pod sticky toolbar */
      border-radius: 14px;
      box-shadow: 0 14px 28px rgba(0,0,0,.10);
    }
    .price-top{ padding: 16px 16px 10px 16px; }
    .price{
      display:flex; align-items: baseline; gap: 6px;
      font-weight: 900;
      color: #111;
    }
    .p-val{ font-size: 26px; }
    .p-curr{ font-size: 14px; opacity: .8; font-weight: 800; }
    .p-suf{ font-size: 12px; opacity: .6; font-weight: 800; }

    .section{ padding: 14px 16px; }
    .sec-title{
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(17,17,17,.55);
      margin-bottom: 10px;
    }
    .dates-box{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      border: 1px solid rgba(17,17,17,.10);
      border-radius: 12px;
      padding: 10px;
      background: rgba(17,17,17,.02);
    }
    .date-item{
      border-radius: 10px;
      padding: 10px;
      background: #fff;
      border: 1px solid rgba(17,17,17,.08);
    }
    .date-label{ font-size: 11px; color: rgba(17,17,17,.55); font-weight: 700; }
    .date-val{ font-size: 13px; color: #111; font-weight: 900; margin-top: 2px; }

    .line{
      display:flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 13px;
      margin-bottom: 8px;
    }
    .total{
      display:flex;
      justify-content: space-between;
      font-weight: 900;
      color: #111;
      font-size: 14px;
    }
    .t-val{ font-size: 16px; }

    .reserve-btn{
      margin: 0 16px 10px 16px;
      height: 46px;
      border-radius: 12px;
      font-weight: 900;
      text-transform: none;
    }
    .fineprint{
      padding: 0 16px 14px 16px;
      color: rgba(17,17,17,.45);
      font-size: 12px;
      text-align: center;
    }

    /* Content cards */
    .content-card{
      border-radius: 14px;
      box-shadow: 0 12px 24px rgba(0,0,0,.08);
      padding: 16px;
    }
    .card-title{
      font-size: 14px;
      font-weight: 900;
      color: #111;
      margin-bottom: 10px;
    }
    .desc{
      margin: 0;
      color: rgba(17,17,17,.62);
      font-size: 13px;
      line-height: 1.7;
    }

    .amenities{
      display:flex;
      flex-wrap: wrap;
      gap: 14px 18px;
      margin-top: 8px;
      color: rgba(17,17,17,.70);
      font-size: 13px;
    }
    .amenity{
      display:flex;
      align-items:center;
      gap: 8px;
      min-width: 160px;
    }
    .amenity mat-icon{
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: .85;
    }

    /* Table */
    .price-table{
      width: 100%;
      margin-top: 6px;
      border-radius: 12px;
      overflow: hidden;
    }
    .price-cell{ font-weight: 900; color: #1976d2; }

    /* Responsive */
    @media (max-width: 991px){
      .book-card{ position: static; top: auto; }
      .gallery{ grid-template-columns: 1fr; }
      .g-side{ grid-template-columns: 1fr 1fr; }
      .g-main{ min-height: 260px; }
      .g-tile{ min-height: 140px; }
    }
  `,
})
export class PublicProductSummaryPage implements OnInit {
  displayedColumns: string[] = ['date', 'price'];
  bookingForm: FormGroup;

  title = signal('Apartament Królewski z Widokiem na Morze');
  location = signal('Gdańsk, Polska');

  pricePerNight = signal<string>('');
  checkIn = signal<string>('');
  checkOut = signal<string>('');
  total = signal<string>('');

  image = signal<string>('');

  amenities = signal<Amenity[]>([
    { icon: 'wifi', label: 'Szybkie Wi-Fi' },
    { icon: 'ac_unit', label: 'Klimatyzacja' },
    { icon: 'king_bed', label: 'Łóżko King Size' },
    { icon: 'tv', label: 'Smart TV 55"' },
    { icon: 'local_cafe', label: 'Ekspres do kawy' },
    { icon: 'bathtub', label: 'Wanna z hydromasażem' },
    { icon: 'liquor', label: 'Minibar' },
    { icon: 'support_agent', label: 'Room Service 24/7' },
  ]);

  priceRows = signal<PricePerDay[]>([
  ]);

  constructor(
    private readonly activatedRouter: ActivatedRoute,
    private readonly router: Router,
    private readonly publicService: PublicService,
    private readonly fb: FormBuilder,
  ) {
    this.bookingForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      companyName: [''],
      nip: [''],
    });
  }

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(queryParams => {
      const dates = {
        startFrom: queryParams['startFrom'] ?? new Date(),
        endedAt: queryParams['endedAt'] ?? new Date(),
      };
      this.activatedRouter.params.subscribe(params => {
        const productId = params['productId'];
        this.publicService.checkAvailabilityForProduct(productId, dates).subscribe((response) => {
          this.checkIn.set(dates.startFrom);
          this.checkOut.set(dates.endedAt);
          this.total.set(response.total);
          this.priceRows.set(response.pricePerDay.slice(0, -1));
          this.image.set(response.product.url);
          this.pricePerNight.set(response.product.price);
        });
      });
    });
  }

  book(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const bookingData = {
      productId: this.activatedRouter.snapshot.params['productId'],
      startFrom: this.checkIn(),
      endedAt: this.checkOut(),
      personInfo: this.bookingForm.value,
    };

    this.publicService.book(bookingData).subscribe({
      next: (booking) => {
        this.router.navigate([`/app/order/${booking.id}`]);
      },
      error: (error) => {
      }
    });
  }

}
