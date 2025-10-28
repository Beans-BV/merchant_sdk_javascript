import { LanguageString } from './language_string';

export interface CompanyAccount {
    id: string;
    companyId: string;
    stellarAccountId: string;
    name: LanguageString;
    avatarUrl?: string;
} 