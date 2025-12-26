import { Routes } from '@angular/router';
import {DashboardPage} from './page/dashboard.page';
import {LocalizationPage} from './page/localization.page';
import {ProductTypeForm} from './components/form/product-type.form';
import {ProductForm} from './components/form/product.form';
import {ProductTypePage} from './page/product-type.page';
import {ProductPage} from './page/product.page';
import {PaymentPage} from './page/payment.page';
import {PaymentConfigurationPage} from './page/payment-configuration.page';
import {DesignPage} from './page/design.page';
import {LocalizationForm} from './components/form/localization.form';

export const routes: Routes = [
  {
    path: 'admin',
    component: DashboardPage,
  },
  {
    path: 'admin/facility',
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
    ]
  },
  {
    path: 'admin/payments',
    children: [
      {
        path: '',
        component: PaymentPage,
      },
      {
        path: 'configuration',
        component: PaymentConfigurationPage,
      },
    ]
  },
  {
    path: 'admin/account',
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
    ]
  },
  {
    path: 'admin/design-page',
    component: DesignPage,
  },
];
