import { CompanyAccount } from './models/company_account';
import { CreateCompanyAccountResponse } from './models/create_company_account_response';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { PaymentRequestStatusResponse } from './models/payment_request_status_response';
import { DeeplinkResponse,PaymentRequestResponse,PngQrCodeResponse,SvgQrCodeResponse } from './models/qr_code_response';
import { StellarCurrency } from './models/stellar_currency';
import { UploadAvatarResponse } from './models/upload_avatar_response';

export {
    CompanyAccount,
    CreateCompanyAccountResponse,FetchStellarCurrenciesResponse,PngQrCodeResponse,StellarCurrency,SvgQrCodeResponse,UploadAvatarResponse
};

export class BeansMerchantSdk {
    private constructor(
        apiBaseUrl: string,
        apiKey: string) {
        this.apiBaseUrl = apiBaseUrl;
        this.apiKey = apiKey;
    }
    static production(apiKey: string): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.beansapp.com/v4', apiKey);
    }
    static staging(apiKey: string): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.staging.beansapp.com/v4', apiKey);
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
                'X-Beans-Company-Api-Key': this.apiKey,
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

    /**
     * Creates a sub-account for the company
     * 
     * @param stellarAccountId The Stellar account ID for the sub-account
     * @param name The name of the sub-account in different languages as a map where
     * the key is the language code (e.g., 'en', 'vi') and the value is the name in that language
     * @returns Promise containing the created company account
     */
    async createCompanyAccount(
        stellarAccountId: string,
        name: Record<string, string>
    ): Promise<CreateCompanyAccountResponse> {
        const url = `${this.apiBaseUrl}/companies/me/account`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey,
            },
            body: JSON.stringify({
                stellarAccountId,
                name
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create company account: ${response.status} ${response.statusText}`);
        }

        const data: CreateCompanyAccountResponse = await response.json();
        return data;
    }

    /**
     * Uploads an avatar for a company sub-account
     * 
     * @param companyId The ID of the company or 'me' for the current company
     * @param stellarAccountId The Stellar account ID of the sub-account
     * @param imageData The image data as a File, Blob, or ArrayBuffer
     * @returns Promise containing the updated company account
     */
    async uploadCompanyAccountAvatar(
        companyId: string,
        stellarAccountId: string,
        imageData: File | Blob | ArrayBuffer
    ): Promise<CompanyAccount> {
        const url = `${this.apiBaseUrl}/companies/${companyId}/accounts/${stellarAccountId}/avatar`;

        const formData = new FormData();
        
        // Convert ArrayBuffer to Blob if needed
        const imageBlob = imageData instanceof ArrayBuffer 
            ? new Blob([imageData]) 
            : imageData;
            
        formData.append('image', imageBlob);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to upload company account avatar: ${response.status} ${response.statusText}`);
        }

        const data: CompanyAccount = await response.json();
        return data;
    }

    /**
     * Gets the avatar for a company sub-account
     * 
     * @param companyId The ID of the company or 'me' for the current company
     * @param accountId The ID of the sub-account
     * @param avatarId The ID of the avatar
     * @returns Promise containing the avatar image as an ArrayBuffer
     */
    async getCompanyAccountAvatar(
        companyId: string,
        accountId: string,
        avatarId: string
    ): Promise<ArrayBuffer> {
        const url = `${this.apiBaseUrl}/companies/${companyId}/accounts/${accountId}/avatar/${avatarId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to get company account avatar: ${response.status} ${response.statusText}`);
        }

        return await response.arrayBuffer();
    }
}
