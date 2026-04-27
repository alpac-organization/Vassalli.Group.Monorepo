import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { VacationServices } from "@app/modules/payroll/infrastructure/services/vacation-services/VacationServices";
const vacationServices = new VacationServices(httpHandler);
type UseVacationPayload = {
   company_id: string;
   module_code: string;
   identification_number: string;
};
export const useVacation = (payload?: UseVacationPayload) => {
   const saldoQueryEnabled = Boolean(
      payload?.company_id &&
      payload?.module_code &&
      payload?.identification_number,
   );

   const GetVacationSaldoQuery = useQuery({
      queryKey: ["vacationSaldo", payload] as const,
      queryFn: () => {
         if (!payload) {
            throw new Error("getVacationSaldo: faltante payload");
         }
         return vacationServices.getVacationSaldo(payload);
      },
      enabled: saldoQueryEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10,
      retry: 1,
   });

   return {
      GetVacationSaldoQuery,
   };
};
