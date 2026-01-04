export interface Order {
  id: string;
  customerId: string;
  bookingId: string;
  bookingPublicId: string;
  externalPaymentIdentifier: string | null;
  name: string;
  totalAmount: string;
  state: OrderState;
  createdAt: string;
  updatedAt: string;
}

export enum OrderState {
  CREATED = 'CREATED',
  PAYMENT_METHOD_UPDATED = 'PAYMENT_METHOD_UPDATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}
