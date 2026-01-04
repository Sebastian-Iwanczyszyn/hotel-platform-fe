import {Component, computed, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatProgressBar} from '@angular/material/progress-bar';
import {filter} from 'rxjs/operators';
import {CommonModule} from '@angular/common';

interface StepInfo {
  step: string;
  stage: string;
  progress: number;
}

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, MatProgressBar, CommonModule],
  styles: `
    .top {
      margin-top: 6px;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
  `,
  template: `
    @if (stepInfo()) {
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="top">
              <div class="top-row">
                <div class="step">{{ stepInfo()!.step }}</div>
                <div class="stage">{{ stepInfo()!.stage }}</div>
              </div>
              <mat-progress-bar class="progress" mode="determinate" [value]="stepInfo()!.progress"></mat-progress-bar>
            </div>
          </div>
        </div>
      </div>
    }

    <router-outlet></router-outlet>
  `,
})
export class PublicLayoutComponent {
  private currentUrl = signal<string>('');

  stepInfo = computed<StepInfo | null>(() => {
    const url = this.currentUrl();

    if (url.includes('/view/')) {
      return {
        step: 'Krok 2 z 4',
        stage: 'Podgląd',
        progress: 50
      };
    }

    if (url.includes('/order/')) {
      return {
        step: 'Krok 3 z 4',
        stage: 'Zamówienie',
        progress: 75
      };
    }

    if (url.includes('/payment/')) {
      return {
        step: 'Krok 4 z 4',
        stage: 'Płatność',
        progress: 100
      };
    }

    return null;
  });

  constructor(
    private readonly router: Router,
  ) {
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.url);
      });
  }
}
