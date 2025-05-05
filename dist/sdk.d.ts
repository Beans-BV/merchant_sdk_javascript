import { CompanyAccount } from './models/company_account';
import { CreateCompanyAccountResponse } from './models/create_company_account_response';
import { DeleteCompanyAccountResponse } from './models/delete_company_account_response';
import { FetchStellarCurrenciesResponse } from './models/fetch_stellar_currencies_response';
import { PaymentRequestStatusResponse } from './models/payment_request_status_response';
import { DeeplinkResponse, PngQrCodeResponse, SvgQrCodeResponse } from './models/qr_code_response';
import { StellarCurrency } from './models/stellar_currency';
import { UploadAvatarResponse } from './models/upload_avatar_response';
export { CompanyAccount, CreateCompanyAccountResponse, DeleteCompanyAccountResponse, FetchStellarCurrenciesResponse, PngQrCodeResponse, StellarCurrency, SvgQrCodeResponse, UploadAvatarResponse };
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
    getPaymentRequestStatus(paymentRequestId: string): Promise<PaymentRequestStatusResponse>;
    /**
     * Creates an Account for the company
     *
     * @param stellarAccountId The Stellar account ID for the Account
     * @param name The name of the Account in different languages as a map where
     * the key is the language code (e.g., 'en', 'vn') and the value is the name in that language
     * @returns Promise containing the created company account
     */
    createCompanyAccount(stellarAccountId: string, name: Record<string, string>): Promise<CreateCompanyAccountResponse>;
    /**
     * Uploads an avatar for a company Account
     *
     * @param companyId The ID of the company or 'me' for the current company
     * @param stellarAccountId The Stellar account ID of the Account
     * @param imageData The image data as a File, Blob, or ArrayBuffer
     * @returns Promise containing the updated company account
     */
    uploadCompanyAccountAvatar(companyId: string, stellarAccountId: string, imageData: File | Blob | ArrayBuffer): Promise<CompanyAccount>;
    /**
     * Gets the avatar for a company Account
     *
     * @param companyId The ID of the company or 'me' for the current company
     * @param accountId The ID of the Account
     * @param avatarId The ID of the avatar
     * @returns Promise containing the avatar image as an ArrayBuffer
     */
    getCompanyAccountAvatar(companyId: string, accountId: string, avatarId: string): Promise<ArrayBuffer>;
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
    deleteCompanyAccount(stellarAccountId: string): Promise<DeleteCompanyAccountResponse>;
    /**
     * Fetches all merchant accounts
     * @returns Promise containing list of company accounts
     */
    getMerchantAccounts(): Promise<CompanyAccount[]>;
    /**
     * Fetches a specific merchant account by Stellar account ID
     * @param stellarAccountId The Stellar account ID to fetch
     * @returns Promise containing the company account
     */
    getMerchantAccount(stellarAccountId: string): Promise<CompanyAccount>;
}
//# sourceMappingURL=sdk.d.ts.map