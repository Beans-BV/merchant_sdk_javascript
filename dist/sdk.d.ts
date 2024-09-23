import { StellarCurrency } from './models/stellar_currency';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { DeeplinkResponse, SvgQrCodeResponse, PngQrCodeResponse } from './models/qr_code_response';
import { PaymentRequestStatusResponse } from './models/payment_request_status_response';
export { StellarCurrency, FetchStellarCurrenciesResponse, SvgQrCodeResponse, PngQrCodeResponse };
export declare class BeansMerchantSdk {
    private constructor();
    static production(apiKey: string): BeansMerchantSdk;
    static staging(apiKey: string): BeansMerchantSdk;
    static custom(apiBaseUrl: string, apiKey: string): BeansMerchantSdk;
    private apiBaseUrl;
    private apiKey;
    fetchStellarCurrencies(stellarAccountId: string): Promise<FetchStellarCurrenciesResponse>;
    generateDeeplink(stellarAccountId: string, stellarCurrencyId: string, amount: number, memo: string, maxAllowedPayments?: number | null, webhookUrl?: string | null): Promise<DeeplinkResponse>;
    generatePngQrCode(stellarAccountId: string, stellarCurrencyId: string, amount: number, memo: string, maxAllowedPayments?: number | null, webhookUrl?: string | null, preferredSize?: number | null): Promise<PngQrCodeResponse>;
    generateSvgQrCode(stellarAccountId: string, stellarCurrencyId: string, amount: number, memo: string, maxAllowedPayments?: number | null, webhookUrl?: string | null, size?: number | null): Promise<SvgQrCodeResponse>;
    private generatePaymentRequest;
    checkPaymentRequest(paymentRequestId: string): Promise<PaymentRequestStatusResponse>;
}
//# sourceMappingURL=sdk.d.ts.map