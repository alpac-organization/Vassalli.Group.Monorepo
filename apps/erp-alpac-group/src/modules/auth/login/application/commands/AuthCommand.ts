export class LoginCommand {

    private readonly _username: string
    private readonly _password: string

    constructor(username: string, password: string) {
        this._username = username
        this._password = password
    }

    getUsername(): string { return this._username; }
    getPassword(): string { return this._password; }
}
