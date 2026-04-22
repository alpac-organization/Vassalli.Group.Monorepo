import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import { CompanyServices } from "@app/modules/auth/infrastructure/services/CompanyServices";
import type { BranchesRequest } from "@app/modules/auth/domain/ApiContract/Requests/branches.request";

const companyServices = new CompanyServices(httpHandler);

export const useCompanies = function (branchesRequest?: BranchesRequest) {

   const GetCompaniesQuery = useQuery({
      queryKey: ["companies"],
      queryFn: () => companyServices.GetCompaniesAvailable(),
      staleTime: 1000 * 60 * 10,
      retry: 1,
   });

   const GetBranchesQuery = useQuery({
      queryKey: ["branches", branchesRequest],
      queryFn: () => companyServices.GetBranchesAvailable(branchesRequest!),
      staleTime: 1000 * 60 * 10,
      retry: 1,
      enabled: !!branchesRequest
   });

   return {
      GetCompaniesQuery,
      GetBranchesQuery,
   };
};
