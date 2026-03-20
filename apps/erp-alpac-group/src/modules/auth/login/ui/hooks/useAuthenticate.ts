import { useMutation } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { LoginCommandHandler } from "../../application/handlers/AuthCommandHandler";
import { LoginCommand } from "../../application/commands/LoginCommand";
import { useCompany } from "@app/shared/providers/company-provider";
import { useNavigate } from "react-router-dom";

export function useAuthenticate() {
    const { companyId } = useCompany()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const repository = new AuthRepository(httpHandler);
            const handler = new LoginCommandHandler(repository);
            const command = new LoginCommand(credentials.username, credentials.password, companyId!);
            return await handler.execute(command);
        },
        onSuccess: (data) => {
            localStorage.setItem("accessToken", data.token)
            console.log("testing", data)
            navigate(`/${companyId}/dashboard`)
        }
    });
}