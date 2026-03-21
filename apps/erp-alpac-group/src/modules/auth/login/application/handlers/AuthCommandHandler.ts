import type { IAuthRepository } from "../../domain/interfaces/IAuthRepository";
import { LoginCommand } from "../commands/LoginCommand";
import type { LoginResponse } from "../dto/LoginRequest";

export class LoginCommandHandler {

    private _authRepository: IAuthRepository

    constructor(authRepository: IAuthRepository) {
        this._authRepository = authRepository
    }

    async execute(command: LoginCommand): Promise<LoginResponse> {
        const user = await this._authRepository.login(
            command.getUsername(),
            command.getPassword(),
            command.getCompanyId()
        );

        return {
            username: user.getUsername(),
            companyId: user.getCompanyId(),
            accessToken: user.getAccessToken(),
            refreshToken: user.getRefreshToken()
        };
    }
}