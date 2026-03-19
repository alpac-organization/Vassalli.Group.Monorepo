// import type { IHttpHandler } from "@app/core/ports";
import type { CompanyProps } from "../../domain/interfaces/CompanyProps";
import type { ICompanyRepository } from "../../domain/interfaces/ICompanyRepository";
import { CompanyEnum } from "@app/core/enums/company.enum";

export class CompanyRepository implements ICompanyRepository {

    // private api: IHttpHandler;

    /* constructor(http: IHttpHandler) {
        this.api = http;
    } */

    async getCompanies(): Promise<CompanyProps[]> {

        /* const response = await this.api.get<CompanyProps[]>("/companies");
        return response */

        const options = Object.entries(CompanyEnum).map(([_, value]) => ({
            id: value,
            companyName: value
        } as CompanyProps));

        return options
    }
}