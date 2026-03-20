import type { IHttpHandler } from "@app/core/ports";
import { User } from "../../domain/entities/User";
import type { IAuthRepository } from "../../domain/interfaces/IAuthRepository";

export class AuthRepository implements IAuthRepository {

    private api: IHttpHandler

    constructor(httpHandler: IHttpHandler) {
        this.api = httpHandler;
    }

    async login(username: string, password: string, companyId: string): Promise<User> {

        const url = `/companies/${companyId}/auth/login`

        const response = await this.api.post<any>(url, {
            username,
            password,
        });

        const user = new User(response)

        return user;
    }
}
