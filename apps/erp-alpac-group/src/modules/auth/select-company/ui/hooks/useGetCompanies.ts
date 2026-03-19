import { useQueries } from "@tanstack/react-query";
import { CompanyRepository } from "../../infraestructure/repositories/CompanyRepository";
import { CompanyCommandHandler } from "../../application/handlers/CompanyCommandHandler";

export function useGetCompanies() {

    return useQueries({
        queries: [
            {
                queryKey: ["companies"],
                queryFn: async () => {
                    const respository = new CompanyRepository();
                    const handler = new CompanyCommandHandler(respository);
                    return handler.execute();
                },
            },
        ],
    })
}
