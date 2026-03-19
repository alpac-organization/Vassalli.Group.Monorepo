export class CompanyCommand {

    private readonly _companyId: string;

    constructor(companyId: string) {
        this._companyId = companyId;
    }

    getCompanyId(): string {
        return this._companyId;
    }
}