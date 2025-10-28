import { ApiException } from './exceptions/api_exception';
import { CompanyAccount } from './models/company_account';
import { CreateCompanyAccountResponse } from './models/create_company_account_response';
import { DeleteCompanyAccountResponse } from './models/delete_company_account_response';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { GetCompanyAccountResponseDto } from './models/get_company_account_response';
import { GetCompanyAccountsResponseDto } from './models/get_company_accounts_response';
import { LanguageString } from './models/language_string';
import { PaymentRequestStatusResponse } from './models/payment_request_status_response';
import { DeeplinkResponse, PaymentRequestResponse, PngQrCodeResponse, SvgQrCodeResponse } from './models/qr_code_response';
import { StellarCurrency } from './models/stellar_currency';

export {
    ApiException,
    CompanyAccount,
    CreateCompanyAccountResponse,
    DeleteCompanyAccountResponse,
    FetchStellarCurrenciesResponse,
    GetCompanyAccountResponseDto,
    GetCompanyAccountsResponseDto,
    PngQrCodeResponse,
    StellarCurrency,
    SvgQrCodeResponse
};

type FetchFunction = typeof fetch;

export class BeansMerchantSdk {
    private constructor(
        apiBaseUrl: string,
        apiKey: string,
        fetchFunction: FetchFunction
    ) {
        this.apiBaseUrl = apiBaseUrl;
        this.apiKey = apiKey;
        this.fetchFunction = fetchFunction;
    }
    static production(apiKey: string, fetchFunction?: FetchFunction): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.beansapp.com/v4', apiKey, fetchFunction ?? fetch);
    }
    static staging(apiKey: string, fetchFunction?: FetchFunction): BeansMerchantSdk {
        return new BeansMerchantSdk('https://api.staging.beansapp.com/v4', apiKey, fetchFunction ?? fetch);
    }
    static custom(apiBaseUrl: string, apiKey: string, fetchFunction?: FetchFunction): BeansMerchantSdk {
        const cleanApiBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, apiBaseUrl.length - 1) : apiBaseUrl;
        return new BeansMerchantSdk(cleanApiBaseUrl, apiKey, fetchFunction ?? fetch);
    }

    private apiBaseUrl: string;
    private apiKey: string;
    private fetchFunction: FetchFunction;

    async fetchStellarCurrencies(stellarAccountId: string): Promise<FetchStellarCurrenciesResponse> {
        const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}/stellar-currencies`;

        const response = await this.fetchFunction(url, {
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to fetch stellar currencies'
            );
        }

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
                "pngQrCode": {
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

        const response = await this.fetchFunction(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey,
            },
            body: JSON.stringify(body)
        });
        
        if (response.status !== 201) {
            throw new ApiException(
                response.status,
                response,
                'Failed to generate payment request'
            );
        }
        
        const data: T = await response.json();
        return data;
    }

    async getPaymentRequestStatus(
        paymentRequestId: string): Promise<PaymentRequestStatusResponse> {
        const url = `${this.apiBaseUrl}/companies/me/payment-requests/${paymentRequestId}/status`;

        const response = await this.fetchFunction(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to get payment request status'
            );
        }

        const data: PaymentRequestStatusResponse = await response.json();
        return data;
    }

    /**
     * Creates an Account for the company
     * 
     * @param stellarAccountId The Stellar account ID for the Account
     * @param name The name of the Account in different languages as a map where
     * the key is the language code (e.g., 'en', 'vn') and the value is the name in that language
     * @returns Promise containing the created company account
     */
    async createCompanyAccount(
        stellarAccountId: string,
        name: LanguageString
    ): Promise<CreateCompanyAccountResponse> {
        const url = `${this.apiBaseUrl}/companies/me/account`;

        const response = await this.fetchFunction(url, {
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

        if (response.status !== 201) {
            throw new ApiException(
                response.status,
                response,
                'Failed to create company account'
            );
        }

        const data: CreateCompanyAccountResponse = await response.json();
        return data;
    }

    /**
     * Uploads an avatar for a company Account
     * 
     * @param companyId The ID of the company or 'me' for the current company
     * @param stellarAccountId The Stellar account ID of the Account
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

        const response = await this.fetchFunction(url, {
            method: 'PUT',
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey,
            },
            body: formData
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to upload company account avatar'
            );
        }

        const data: CompanyAccount = await response.json();
        return data;
    }

    /**
     * Gets the avatar bytes from a URL
     * 
     * @param avatarUrl The full URL of the avatar
     * @returns Promise containing the avatar image as an ArrayBuffer
     */
    async getAvatarUrlBytes(avatarUrl: string): Promise<ArrayBuffer> {
        const response = await this.fetchFunction(avatarUrl, {
            method: 'GET',
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey,
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to get company account avatar'
            );
        }

        return await response.arrayBuffer();
    }

    /**
     * Deletes an Account for the company
     * 
     * @param stellarAccountId The Stellar account ID of the Account to delete
     * @returns Promise containing the deleted company account and status information
     * 
     * @example
     * ```typescript
     * const response = await sdk.deleteCompanyAccount('GCQYCNYU3T73JCQ2J36A3JJ5CUQO4DY4EOKMPUL5723ZH7N6XMMNPAA3');
     * console.log('Deleted account:', response.account.id);
     * console.log('Status:', response.status);
     * ```
     */
    async deleteCompanyAccount(
        stellarAccountId: string
    ): Promise<DeleteCompanyAccountResponse> {
        const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}`;

        const response = await this.fetchFunction(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Beans-Company-Api-Key': this.apiKey,
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to delete company account'
            );
        }

        const data: DeleteCompanyAccountResponse = await response.json();
        return data;
    }

    /**
     * Fetches all company accounts
     * @returns Promise containing the response DTO with company accounts
     */
    async getCompanyAccounts(): Promise<GetCompanyAccountsResponseDto> {
        const url = `${this.apiBaseUrl}/companies/me/accounts`;

        const response = await this.fetchFunction(url, {
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to fetch company accounts'
            );
        }

        const responseData: GetCompanyAccountsResponseDto = await response.json();
        return responseData;
    }

    /**
     * Fetches a specific company account by Stellar account ID
     * @param stellarAccountId The Stellar account ID to fetch
     * @returns Promise containing the response DTO with company account
     */
    async getCompanyAccount(stellarAccountId: string): Promise<GetCompanyAccountResponseDto> {
        const url = `${this.apiBaseUrl}/companies/me/accounts/${stellarAccountId}`;

        const response = await this.fetchFunction(url, {
            headers: {
                'X-Beans-Company-Api-Key': this.apiKey
            }
        });

        if (response.status !== 200) {
            throw new ApiException(
                response.status,
                response,
                'Failed to fetch company account'
            );
        }

        const responseData: GetCompanyAccountResponseDto = await response.json();
        return responseData;
    }

    private _getMimeTypeFromExtension(extension: string): string {
        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            default:
                throw new Error(`Unsupported file extension: ${extension}`);
        }
    }
}
