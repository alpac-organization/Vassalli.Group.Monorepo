import type { User } from "../entities/User";

export interface IAuthRepository {
    login(username: string, password: string, companyId: string): Promise<User>
}