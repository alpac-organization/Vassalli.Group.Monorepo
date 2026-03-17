import type { UserProps } from "../interfaces/UserProps"

export class User {
    public readonly id: string
    private readonly _username: string
    private readonly _token: string

    constructor(props: UserProps) {
        this.id = props.id
        this._username = props.username
        this._token = props.token
    }

    getId(): string { return this.id; }
    getUsername(): string { return this._username; }
    getToken(): string { return this._token }
}