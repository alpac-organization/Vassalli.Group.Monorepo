import type { UserProps } from "../interfaces/UserProps"

export class User {

    private readonly _username: string
    private readonly _companyId: string
    private readonly _accessToken: string
    private readonly _refreshToken: string

    constructor(props: UserProps) {
        this._username = props.user_name
        this._companyId = props.company_information.company_id.toString()
        this._accessToken = props.access_token
        this._refreshToken = props.refresh_token
    }

    getUsername(): string { return this._username; }
    getCompanyId(): string { return this._companyId }
    getAccessToken(): string { return this._accessToken }
    getRefreshToken(): string { return this._refreshToken }
}