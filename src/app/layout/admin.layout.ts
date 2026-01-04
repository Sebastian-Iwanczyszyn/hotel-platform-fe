import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Menu} from '../components/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, Menu],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto p-0">
          <app-menu></app-menu>
        </div>
        <div class="col">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }

    .container-fluid {
      height: 100vh;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    .row {
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }

    .col-auto {
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .col {
      height: 100vh;
      overflow-y: auto;
      background: #f9fafb;
      padding: 24px;
    }
  `
})
export class AdminLayout {}
