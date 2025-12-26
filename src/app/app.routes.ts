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
        path: 'localizations/:id',
        component: LocalizationForm,
      },
      {
        path: 'products',
        component: ProductPage,
      },
      {
        path: 'products/:id',
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
        path: 'product-types/:id',
        component: ProductTypeForm,
      },
    ]
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
    ]
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
    ]
  },
  {
    path: 'settings',
    component: DesignPage,
  },
];
