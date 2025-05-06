import { CompanyAccount } from './company_account';
/**
 * Response object returned when deleting a company Account
 */
export interface DeleteCompanyAccountResponse {
    /**
     * The deleted account
     */
    account: CompanyAccount;
    /**
     * The status of the deletion operation
     */
    status: string;
}
//# sourceMappingURL=delete_company_account_response.d.ts.map