import type { UserProps } from "../interfaces/UserProps"

export class User {

    private readonly _username: string
    private readonly _companyId: string
    private readonly _token: string

    constructor(props: UserProps) {
        this._username = props.user_name
        this._companyId = props.company_information.company_id.toString()
        this._token = props.access_token
    }

    getUsername(): string { return this._username; }
    getCompanyId(): string { return this._companyId }
    getToken(): string { return this._token }
}