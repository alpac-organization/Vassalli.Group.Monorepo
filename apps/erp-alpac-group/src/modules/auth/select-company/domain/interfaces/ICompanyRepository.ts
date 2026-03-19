import type { CompanyProps } from "./CompanyProps";

export interface ICompanyRepository {
    getCompanies(): Promise<CompanyProps[]>;
}