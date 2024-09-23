export interface PaymentRequestStatusResponse {
  status: PaymentRequestStatus;
}

export enum PaymentRequestStatus {
  Completed = 'completed',
  Pending = 'pending',
}