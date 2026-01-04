import {Routes} from '@angular/router';
import {DashboardPage} from './page/dashboard.page';
import {LocalizationPage} from './page/localization.page';
import {ProductTypeForm} from './components/form/product-type.form';
import {ProductForm} from './components/form/product.form';
import {ProductTypePage} from './page/product-type.page';
import {ProductPage} from './page/product.page';
import {PaymentPage} from './page/payment.page';
import {DesignPage} from './page/design.page';
import {LocalizationForm} from './components/form/localization.form';
import {PaymentConfigurationPage} from './page/payment-configuration.page';
import {PublicLocalizationPage} from './page/public/public-localization-page.component';
import {PublicLayoutComponent} from './layout/public.layout';
import {AdminLayout} from './layout/admin.layout';
import {PublicProductSummaryPage} from './page/public/public-product-summary.page';
import {PublicPaymentPage} from './page/public/public-payment.page';
import {PublicPaymentProcessPage} from './page/public/public-payment-process.page';
import {authenticatedGuard} from './guard/authenticated-guard';
import {NotFoundPage} from './page/not-found.page';
import {BookingPage} from './page/booking.page';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: DashboardPage,
      },
      {
        path: 'facility',
        children: [
          {
            path: 'localizations',
            component: LocalizationPage,
          },
          {
            path: 'localizations/create',
            component: LocalizationForm,
          },
          {
            path: 'localizations/view/:id',
            component: LocalizationForm,
          },
          {
            path: 'products',
            component: ProductPage,
          },
          {
            path: 'products/view/:id',
            component: ProductForm,
          },
          {
            path: 'products/create',
            component: ProductForm,
          },
          {
            path: 'product-types',
            component: ProductTypePage,
          },
          {
            path: 'product-types/create',
            component: ProductTypeForm,
          },
          {
            path: 'product-types/view/:id',
            component: ProductTypeForm,
          },
        ],
      },
      {
        path: 'booking',
        children: [
          {
            path: '',
            component: BookingPage,
          },
        ],
      },
      {
        path: 'payments',
        children: [
          {
            path: '',
            component: PaymentPage,
          },
          {
            path: 'configuration',
            component: PaymentConfigurationPage,
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: 'update-info',
            component: PaymentConfigurationPage,
          },
          {
            path: 'licenses',
            component: PaymentConfigurationPage,
          },
          {
            path: 'settings',
            component: PaymentConfigurationPage,
          },
        ],
      },
      {
        path: 'design-page',
        component: DesignPage,
      },
    ],
    canActivate: [authenticatedGuard]
  },
  {
    path: 'app',
    component: PublicLayoutComponent,
    children: [
      {
        path: ':id',
        component: PublicLocalizationPage,
      },
      {
        path: 'view/:productId',
        component: PublicProductSummaryPage,
      },
      {
        path: 'order/:bookingId',
        component: PublicPaymentPage,
      },
      {
        path: 'process/payment/:bookingId/bank-transfer',
        component: PublicPaymentProcessPage,
      },
    ],
  },
  {
    path: '**',
    component: NotFoundPage,
  },
];
