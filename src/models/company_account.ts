export interface CompanyAccount {
    id: string;
    companyId: string;
    stellarAccountId: string;
    name: Record<string, string>;
    avatarId?: string;
} 