import type { CompanyProps } from "../../domain/interfaces/CompanyProps";
import type { ICompanyRepository } from "../../domain/interfaces/ICompanyRepository";

export class CompanyCommandHandler {

    private _companyRepository: ICompanyRepository;

    constructor(companyRepository: ICompanyRepository) {
        this._companyRepository = companyRepository;
    }

    async execute(): Promise<CompanyProps[]> {
        return this._companyRepository.getCompanies();
    }
}