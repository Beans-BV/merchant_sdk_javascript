
import { BeansMerchantSdkEnvironment } from './environment';
import { StellarCurrency } from './models/stellar_currency';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { SvgQrCodeResponse, PngQrCodeResponse } from './models/qr_code_response';

export { BeansMerchantSdkEnvironment, StellarCurrency, FetchStellarCurrenciesResponse, SvgQrCodeResponse, PngQrCodeResponse };

export class BeansMerchantSdk {
    constructor(environment: BeansMerchantSdkEnvironment, apiKey: string, debug: boolean = false) {
        this.environment = environment;
        this.apiKey = apiKey;
        this.debug = debug;
    }

    private apiKey: string;
    private environment: BeansMerchantSdkEnvironment;
    private debug: boolean;

    async fetchCurrencies(stellarAccountId: string): Promise<FetchStellarCurrenciesResponse> {
        const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/stellar-currencies`;
        try {
            const response = await fetch(url, {
                headers: {
                    'X-Beans-Company-Api-Key': this.apiKey
                }
            });
            const data: FetchStellarCurrenciesResponse = await response.json();
            return data;
        } catch (error) {
            if (this.debug) {
                console.error('Error fetching currencies:', error);
            }
            throw error;
        }
    }

    async generatePngQRCode(
        stellarAccountId: string,
        currencyId: string,
        amount: number,
        memo: string,
        webhookUrl: string | null = null,
        preferredSize: number | null = null
    ): Promise<PngQrCodeResponse> {
        const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;
        const body = {
            "stellarCurrencyId": currencyId,
            "amount": amount,
            "memo": memo,
            "paymentReceivedWebHookUrl": webhookUrl,
            "deeplink": {
                "include": true
            },
            "pngQrCodeBase64String": {
                "include": true,
                "preferredSize": preferredSize
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Beans-Company-Api-Key': this.apiKey
                },
                body: JSON.stringify(body)
            });
            const data: PngQrCodeResponse = await response.json();
            return data;
        } catch (error) {
            if (this.debug) {
                console.error('Error generating QR code:', error);
            }
            throw error;
        }
    }

    async generateSvgQRCode(
        stellarAccountId: string,
        currencyId: string,
        amount: number,
        memo: string,
        webhookUrl: string | null = null,
        size: number | null = null
    ): Promise<SvgQrCodeResponse> {
        const url = `https://${this.environment}/v3/companies/me/accounts/${stellarAccountId}/payment-request`;
        const body = {
            "stellarCurrencyId": currencyId,
            "amount": amount,
            "memo": memo,
            "paymentReceivedWebHookUrl": webhookUrl,
            "deeplink": {
                "include": true
            },
            "svgQrCode": {
                "include": true,
                "size": size
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Beans-Company-Api-Key': this.apiKey
                },
                body: JSON.stringify(body)
            });
            const data: SvgQrCodeResponse = await response.json();
            return data;
        } catch (error) {
            if (this.debug) {
                console.error('Error generating QR code:', error);
            }
            throw error;
        }
    }
}
