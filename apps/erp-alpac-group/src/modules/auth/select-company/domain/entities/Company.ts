import type { CompanyProps } from "../interfaces/CompanyProps"

export class Company {
    public readonly id: string
    private readonly _companyName: string

    constructor(props: CompanyProps) {
        this.id = props.id
        this._companyName = props.companyName
    }

    getId(): string { return this.id }
    getCompanyName(): string { return this._companyName }
}