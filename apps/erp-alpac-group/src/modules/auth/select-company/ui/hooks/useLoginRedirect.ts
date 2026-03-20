import { useMutation } from "@tanstack/react-query";
import { SelectCompanyCommandHandler } from "../../application/handlers/SelectCompanyCommandHandler";
import { CompanyCommand } from "../../application/command/CompanyCommand";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@app/shared/providers/company-provider";

export function useLoginRedirect() {

    const { setCompanyId } = useCompany();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (companyId: string) => {
            const handler = new SelectCompanyCommandHandler();
            const command = new CompanyCommand(companyId);
            return await handler.execute(command);
        },
        onSuccess: (id) => {
            setCompanyId(id);
            navigate(`/${id}/auth`);
        }
    })
}