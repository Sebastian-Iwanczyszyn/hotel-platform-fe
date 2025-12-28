import {Directive, inject, OnInit, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {
  Configuration,
  PaymentProvider,
  PaymentProviderType,
  PaymentService,
  PayUConfiguration
} from '../../service/payment.service';
import {PaymentConfigurationSubmitted} from '../../model/payment';

@Directive()
export abstract class PaymentForm<T extends Configuration> implements OnInit {
  private router = inject(Router);
  private service = inject(PaymentService);
  submit = output<PaymentConfigurationSubmitted>();
  id: string|undefined;
  form!: FormGroup;

  protected constructor(
    protected readonly paymentProviderType: PaymentProviderType,
  ) {

  }

  ngOnInit(): void {
    this.form = this.creteForm();
    this.service.getByType<T>(this.paymentProviderType).subscribe(response => {
      this.id = response.id;
      this.patchForm(response);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submit.emit(new PaymentConfigurationSubmitted(
      this.id ?? null,
      this.form.value as PayUConfiguration,
      this.form.value.active,
      PaymentProviderType.PAYU,
    ));
  }

  protected abstract creteForm(): FormGroup;

  protected abstract patchForm(response: PaymentProvider<T>): void;

  onCancel(): void {
    this.router.navigate(['/admin/payments']);
  }
}
