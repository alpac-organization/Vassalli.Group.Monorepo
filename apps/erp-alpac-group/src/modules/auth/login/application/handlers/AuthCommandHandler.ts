import type { IAuthRepository } from "../../domain/interfaces/IAuthRepository";
import { LoginCommand } from "../commands/AuthCommand";
import type { LoginResponse } from "../dto/AuthRequest";

export class LoginCommandHandler {

    private _authRepository: IAuthRepository

    constructor(authRepository: IAuthRepository) {
        this._authRepository = authRepository
    }

    async execute(command: LoginCommand): Promise<LoginResponse> {
        const user = await this._authRepository.login(
            command.getUsername(),
            command.getPassword()
        );

        return {
            id: user.getId(),
            username: user.getUsername(),
            token: user.getToken(),
        };
    }
}