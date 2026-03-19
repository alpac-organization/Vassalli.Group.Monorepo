import { useQuery } from "@tanstack/react-query";
import { CompanyRepository } from "../../infraestructure/repositories/CompanyRepository";
import { CompanyCommandHandler } from "../../application/handlers/CompanyCommandHandler";
import { AxiosHttpAdapter } from "@app/core/adapters";

export function useGetCompanies() {

    return useQuery({
        queryKey: ["companies"],
        queryFn: async () => {
            const httpAdapter = new AxiosHttpAdapter();
            const repository = new CompanyRepository(httpAdapter);
            const handler = new CompanyCommandHandler(repository);
            return await handler.execute();
        },
    })
}
