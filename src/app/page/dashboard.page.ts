import {Component} from '@angular/core';
import {AvailableLocalization} from '../components/available-localization';

@Component({
  standalone: true,
  selector: 'page-dashboard',
  imports: [
    AvailableLocalization
  ],
  template: `
    <div class="container-fluid">
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
