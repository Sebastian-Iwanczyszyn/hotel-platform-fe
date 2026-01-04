import {Component} from '@angular/core';
import {AvailableLocalization} from '../components/dashboard/available-localization';
import {KpiOverviewComponent} from '../components/dashboard/kpi-overview';

@Component({
  standalone: true,
  selector: 'page-dashboard',
  imports: [
    AvailableLocalization,
    KpiOverviewComponent
  ],
  template: `
    <div class="container-fluid">

      <div class="row">
        <div class="col-sm-12">
          <app-kpi-overview></app-kpi-overview>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <app-available-localization></app-available-localization>
        </div>
      </div>
    </div>
  `,
  styles: `

  `,
})
export class DashboardPage {
}
