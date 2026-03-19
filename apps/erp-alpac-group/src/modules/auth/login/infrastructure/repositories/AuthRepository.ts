import type { IHttpHandler } from "@app/core/ports";
import { User } from "../../domain/entities/User";
import type { IAuthRepository } from "../../domain/interfaces/IAuthRepository";

export class AuthRepositoryImpl implements IAuthRepository {

    private api: IHttpHandler

    constructor(httpHandler: IHttpHandler) {
        this.api = httpHandler;
    }

    async login(username: string, password: string): Promise<User> {
        const response = await this.api.post<any>("/auth/login", {
            username,
            password,
        });

        return new User(response);
    }

    async getCurrentUser(): Promise<User | null> {
        const response = await this.api.get<any>("/auth/me");
        if (!response) return null;
        return new User(response);
    }
}
