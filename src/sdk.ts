import { StellarCurrency } from './models/stellar_currency';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { PaymentRequestResponse, DeeplinkResponse, SvgQrCodeResponse, PngQrCodeResponse } from './models/qr_code_response';
import { PaymentRequestStatusResponse } from './models/payment_request_status_response';

export { StellarCurrency, FetchStellarCurrenciesResponse, SvgQrCodeResponse, PngQrCodeResponse };

export class BeansMerchantSdk {
    private constructor(
        apiBaseUrl: string,
        apiKey: string) {
        this.apiBaseUrl = apiBaseUrl;
        this.apiKey = apiKey;
    }
    static production(apiKey: string): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.beansapp.com/v3', apiKey);
    }
    static staging(apiKey: string): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.staging.beansapp.com/v3', apiKey);
    }
    static custom(apiBaseUrl: string, apiKey: string): BeansMerchantSdk {
        const cleanApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, apiBaseUrl.length - 1) : apiBaseUrl;
        return new BeansMerchantSdk(cleanApiBaseUrl, apiKey);
    }

    private apiBaseUrl: string;
    private apiKey: string;

    async fetchStellarCurrencies(stellarAccountId: string): Promise<FetchStellarCurrenciesResponse> {
        const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}/stellar-currencies`;

        const response = await fetch(url, {
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });
        const data: FetchStellarCurrenciesResponse = await response.json();
        return data;
    }

    async generateDeeplink(
        stellarAccountId: string,
        stellarCurrencyId: string,
        amount: number,
        memo: string,
        maxAllowedPayments: number | null = null,
        webhookUrl: string | null = null
    ): Promise<DeeplinkResponse> {
        const response = await this.generatePaymentRequest<DeeplinkResponse>(
            stellarAccountId,
            {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                }
            }
        );
        return response;
    }

    async generatePngQrCode(
        stellarAccountId: string,
        stellarCurrencyId: string,
        amount: number,
        memo: string,
        maxAllowedPayments: number | null = null,
        webhookUrl: string | null = null,
        preferredSize: number | null = null
    ): Promise<PngQrCodeResponse> {
        const response = await this.generatePaymentRequest<PngQrCodeResponse>(
            stellarAccountId,
            {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                },
                "pngQrCodeBase64String": {
                    "include": true,
                    "preferredSize": preferredSize
                }
            }
        );
        return response;
    }

    async generateSvgQrCode(
        stellarAccountId: string,
        stellarCurrencyId: string,
        amount: number,
        memo: string,
        maxAllowedPayments: number | null = null,
        webhookUrl: string | null = null,
        size: number | null = null
    ): Promise<SvgQrCodeResponse> {
        const response = await this.generatePaymentRequest<SvgQrCodeResponse>(
            stellarAccountId,
            {
                "stellarCurrencyId": stellarCurrencyId,
                "amount": amount,
                "memo": memo,
                "maxAllowedPayments": maxAllowedPayments,
                "paymentReceivedWebHookUrl": webhookUrl,
                "deeplink": {
                    "include": true
                },
                "svgQrCode": {
                    "include": true,
                    "size": size
                }
            }
        );
        return response;
    }

    private async generatePaymentRequest<T extends PaymentRequestResponse>(
        stellarAccountId: string,
        body: any): Promise<T> {
        const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}/payment-request`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey
            },
            body: JSON.stringify(body)
        });
        const data: T = await response.json();
        return data;
    }

    async getPaymentRequestStatus(
        paymentRequestId: string): Promise<PaymentRequestStatusResponse> {
        const url = `${this.apiBaseUrl}/companies/me/payment-requests/${paymentRequestId}/status`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });
        const data: PaymentRequestStatusResponse = await response.json();
        return data;
    }
}
