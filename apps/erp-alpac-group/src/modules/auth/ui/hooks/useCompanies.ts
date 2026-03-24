import { useQuery } from "@tanstack/react-query"
import { httpHandler } from "@app/core/adapters/axiosAdapter"
import { CompanyServices } from "../../infrastructure/services/CompanyServices";

const companyServices = new CompanyServices(httpHandler);

export const useCompanies = function () {

   const GetCompaniesQuery = useQuery({
      queryKey: ["companies"],
      queryFn: () => companyServices.GetCompaniesAvailable(),
      staleTime: 1000 * 60 * 10,
      retry: 1
   });

   return {
      GetCompaniesQuery
   }
}