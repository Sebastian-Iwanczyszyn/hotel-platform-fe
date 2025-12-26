import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {keycloak} from '../keycloak';

interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  active?: boolean;
  children?: MenuItem[];
  expanded?: boolean;
}

interface MenuConfig {
  logo: {
    icon: string;
    text: string;
  };
  mainItems: MenuItem[];
  bottomItems: MenuItem[];
  helpSection: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
  };
}

@Component({
  standalone: true,
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="menu-container">
      <div class="menu-header">
        <div class="logo">
          <div class="logo-icon-wrapper">
            <mat-icon class="logo-icon">{{ menuConfig.logo.icon }}</mat-icon>
          </div>
          <span class="logo-text">{{ menuConfig.logo.text }}</span>
        </div>
      </div>

      <mat-nav-list class="menu-list">
        @for (item of menuConfig.mainItems; track item.label) {
          <div class="menu-item-wrapper">
            @if (item.children) {
              <a mat-list-item
                 class="menu-item"
                 [class.active]="item.active"
                 (click)="toggleItem(item); $event.preventDefault()"
                 style="cursor: pointer;">
                <div class="item-content">
                  <mat-icon class="item-icon">{{ item.icon }}</mat-icon>
                  <span class="item-label">{{ item.label }}</span>
                </div>
                <mat-icon class="expand-icon">
                  {{ item.expanded ? 'expand_less' : 'expand_more' }}
                </mat-icon>
              </a>
            } @else {
              <a mat-list-item
                 class="menu-item"
                 [class.active]="item.active"
                 [routerLink]="['/admin'+item.path]">
                <div class="item-content">
                  <mat-icon class="item-icon">{{ item.icon }}</mat-icon>
                  <span class="item-label">{{ item.label }}</span>
                </div>
              </a>
            }

            @if (item.children && item.expanded) {
              <div class="submenu">
                @for (child of item.children; track child.label) {
                  <a mat-list-item
                     class="menu-item submenu-item"
                     [class.active]="child.active"
                     [routerLink]="['/admin'+child.path]">
                    <div class="item-content">
                      <mat-icon class="item-icon">{{ child.icon }}</mat-icon>
                      <span class="item-label">{{ child.label }}</span>
                    </div>
                  </a>
                }
              </div>
            }
          </div>
        }
      </mat-nav-list>

      <mat-nav-list class="menu-list-bottom">
        <a mat-list-item
           (click)="logout()"
           class="menu-item">
          <div class="item-content">
            <mat-icon class="item-icon">sign-out</mat-icon>
            <span class="item-label">Wyloguj</span>
          </div>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: `
    .menu-container {
      width: 280px;
      height: 95vh;
      background: linear-gradient(180deg, #f2f2f2 0%, #ffffff 100%);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    }

    .menu-header {
      padding: 0 8px 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon-wrapper {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    }

    .logo-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .menu-list {
      padding: 0;
      flex: 1;
    }

    .menu-item-wrapper {
      margin-bottom: 4px;
    }

    .menu-list-bottom {
      padding: 0;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
      margin-top: 16px;
    }

    .menu-item {
      height: 52px;
      color: #6b7280;
      border-radius: 12px;
      margin: 0;
      padding: 0 12px;
      transition: all 0.2s ease;
      position: relative;

      &.active {
        background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
        color: #7c3aed;
        box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
      }

      &:hover:not(.active) {
        background: #f3f4f6;
        transform: translateX(2px);
      }
    }

    .item-content {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .item-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: inherit;
    }

    .item-label {
      font-size: 15px;
      font-weight: 500;
      color: inherit;
      letter-spacing: -0.01em;
    }

    .expand-icon {
      position: absolute;
      right: 12px;
      top: 15px;
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: inherit;
      transition: transform 0.2s ease;
    }

    .submenu {
      padding-left: 20px;
      margin-top: 4px;
    }

    .submenu-item {
      height: 44px;
      font-size: 14px;
    }

    ::ng-deep .mat-mdc-list-item {
      --mdc-list-list-item-hover-state-layer-color: transparent;
    }
  `,
})
export class Menu {
  menuConfig: MenuConfig = {
    logo: {
      icon: 'apps',
      text: 'Business'
    },
    mainItems: [
      {icon: 'dashboard', label: 'Dashboard', path: ''},
      {
        icon: 'analytics',
        label: 'Facility',
        path: '#',
        active: false,
        children: [
          {icon: '', label: 'Localizations', path: '/facility/localizations'},
          {icon: '', label: 'Product Types', path: '/facility/product-types'},
          {icon: '', label: 'Products', path: '/facility/products'},
        ]
      },
      {
        icon: 'payments',
        label: 'Płatności',
        path: '#',
        active: false,
        children: [
          {icon: '', label: 'Zamówienia', path: '/payments'},
          {icon: '', label: 'Konfiguracja', path: '/payments/configuration'},
        ]
      },
      {
        icon: 'person',
        label: 'Moje konto',
        path: '#',
        active: false,
        children: [
          {icon: '', label: 'Zmień dane', path: '/account/update-info'},
          {icon: '', label: 'Licencje', path: '/account/licenses'},
          {icon: '', label: 'Ustawienia', path: '/account/settings'},
        ]
      },
      {
        icon: 'settings',
        label: 'Ustawienia strony rezerwacji',
        path: '/design-page'
      },
    ],
    bottomItems: [
      {icon: 'logout', label: 'Sign Out', path: '/logout'}
    ],
    helpSection: {
      image: 'assets/help-avatar.png',
      title: 'Need help',
      subtitle: 'feel free to contact',
      buttonText: 'Get Support'
    }
  };

  constructor(private router: Router) {
  }

  async logout(): Promise<void> {
    await keycloak.logout();
  }

  toggleItem(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
