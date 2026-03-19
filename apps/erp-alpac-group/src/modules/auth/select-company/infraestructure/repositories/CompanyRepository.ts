import type { IHttpHandler } from "@app/core/ports";
import type { CompanyProps } from "../../domain/interfaces/CompanyProps";
import type { ICompanyRepository } from "../../domain/interfaces/ICompanyRepository";

export class CompanyRepository implements ICompanyRepository {

    private apiKey = import.meta.env.VITE_API_KEY;
    private api: IHttpHandler;

    constructor(http: IHttpHandler) {
        this.api = http;
    }

    async getCompanies(): Promise<CompanyProps[]> {

        const response = await this.api.get<CompanyProps[]>("/companies", {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.apiKey
            },
        });
        return response
    }
}