import {
  Configuration,
  PaymentProviderType,
} from '../service/payment.service';

export class PaymentConfigurationSubmitted<T extends Configuration = any> {
  constructor(
    readonly id: string|null,
    readonly configuration: T,
    readonly active: boolean,
    readonly type: PaymentProviderType,
  ) {
  }
}
