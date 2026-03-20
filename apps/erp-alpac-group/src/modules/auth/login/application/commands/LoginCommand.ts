export class LoginCommand {

    private readonly _username: string
    private readonly _password: string
    private readonly _companyId: string

    constructor(username: string, password: string, companyId: string) {
        this._username = username
        this._password = password
        this._companyId = companyId
    }

    getUsername(): string { return this._username; }
    getPassword(): string { return this._password; }
    getCompanyId(): string { return this._companyId; }
}
