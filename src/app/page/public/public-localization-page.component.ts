import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PublicWebsiteConfiguration } from '../../service/website-configuration.service';
import { BookingSearch } from '../../components/booking-search';
import { AvailabilityDto, PublicService } from '../../service/public.service';
import { BookingTile } from '../../components/booking-tile';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'page-public-localization',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BookingSearch,
    BookingTile,
    MatProgressSpinnerModule,
  ],
  template: `
    @if (isConfigurationReady()) {
      <section
        class="hero"
        [style.background-image]="'url(' + websiteConfiguration()?.backgroundImageUrl + ')'"
        aria-label="Hero section"
      >
        <div class="hero-overlay"></div>

        <div class="container hero-inner">
          <div class="row">
            <div class="col-12">
              @if (websiteConfiguration()?.configuration) {
                <h1 class="hero-title">{{ websiteConfiguration()!.configuration.title }}</h1>
                <h3 class="hero-subtitle">
                  {{ websiteConfiguration()!.configuration.subTitle }}
                </h3>
              }
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-12 col-lg-10">
              <div class="search-card">
                @if (publicLocalizationId()) {
                  <app-booking-search
                    [publicLocalizationId]="publicLocalizationId()"
                    (availabilityFound)="availabilityFound($event)"
                    (isSearching)="isSearching.set($event)"
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </section>

    }

    <!-- RESULTS -->
    <section class="results">
      <div class="container">

        @if (isSearching()) {
          <div class="row">
            <div class="col-12 justify-content-center text-center d-flex">
              <mat-progress-spinner
                mode="indeterminate"
                diameter="130">
              </mat-progress-spinner>
            </div>
          </div>
        }

        @if (!isSearching() && availability().length > 0) {
          <app-booking-tile [availability]="availability()"/>
        }

      </div>
    </section>
  `,
  styles: `
    /* Topbar */
    .topbar{
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(17,17,17,.08);
      height: 64px;
    }
    .brand-mark{
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display:flex;
      align-items:center;
      justify-content:center;
      background: rgba(25,118,210,.12);
      color: #1976d2;
    }
    .brand-name{
      font-weight: 800;
      letter-spacing: -0.2px;
      color: #111;
    }
    .nav-link{
      text-decoration: none;
      color: rgba(17,17,17,.75);
      font-weight: 600;
      font-size: 14px;
    }
    .nav-link:hover{ color: #111; }
    .login-btn{ border-radius: 12px; }

    /* Hero */
    .hero{
      position: relative;
      min-height: 420px;
      background-size: cover;
      background-position: center;
      display:flex;
      align-items:center;
      padding: 84px 0 70px 0; /* miejsce na card */
    }
    .hero-overlay{
      position:absolute;
      inset:0;
      background: linear-gradient(
          135deg,
          rgba(0,0,0,.35),
          rgba(0,0,0,.25)
      );
    }
    .hero-inner{
      position: relative;
      z-index: 1;
    }
    .hero-title{
      font-weight: 900;
      font-size: 44px;
      letter-spacing: -0.8px;
      color: #fff;
    }
    .hero-subtitle{
      max-width: 720px;
      color: rgba(255,255,255,.88);
      font-size: 22px;
      line-height: 1.6;
    }

    /* Results */
    .results{
      padding: 28px 0 40px 0;
      background: #fff;
    }
    .results-title{
      margin: 0;
      font-size: 26px;
      font-weight: 900;
      color: #111;
      letter-spacing: -0.3px;
    }
    .results-subtitle{
      margin: 6px 0 0 0;
      color: rgba(17,17,17,.6);
      font-size: 13px;
    }
    .empty-state{
      border: 1px dashed rgba(17,17,17,.2);
      border-radius: 14px;
      padding: 16px;
      color: rgba(17,17,17,.65);
      background: rgba(17,17,17,.02);
    }

    @media (max-width: 991px){
      .hero{ padding: 62px 0 56px 0; min-height: 380px; }
      .hero-title{ font-size: 34px; }
      .search-card{ margin-top: 26px; }
    }
  `,
})
export class PublicLocalizationPage implements OnInit {
  websiteConfiguration = signal<PublicWebsiteConfiguration | undefined>(undefined);
  publicLocalizationId = signal<string | undefined>(undefined);
  availability = signal<AvailabilityDto[]>([]);
  isSearching = signal<boolean>(false);
  isConfigurationReady = computed(() => {
    const config = this.websiteConfiguration();
    return config?.configuration !== undefined;
  });
  constructor(
    private readonly publicService: PublicService,
    private readonly router: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe(params => {
      const id = params['id'];
      this.publicLocalizationId.set(id);
      this.publicService.getConfigurationById(id).subscribe((response) => {
        this.websiteConfiguration.set(response);
      });
    });
  }

  availabilityFound(data: AvailabilityDto[]) {
    this.availability.set(data);
  }
}
