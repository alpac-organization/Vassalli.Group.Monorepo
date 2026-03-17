import { useMutation } from "@tanstack/react-query";
import { httpHandler } from "@app/shared/http/adapters";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/AuthRespositoryImpl";
import { LoginCommandHandler } from "../../application/handlers/AuthCommandHandler";
import { LoginCommand } from "../../application/commands/AuthCommand";

export function useAuthenticate() {
    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const repository = new AuthRepositoryImpl(httpHandler);
            const handler = new LoginCommandHandler(repository);
            const command = new LoginCommand(credentials.username, credentials.password);
            return handler.execute(command);
        },
    });
}