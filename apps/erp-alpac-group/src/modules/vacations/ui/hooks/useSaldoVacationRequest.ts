import { useQuery } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters";
import { VacationSaldoServices } from "@app/modules/vacations/infrastructure/services/VacationSaldoServices";
import { useUserStore } from "@app/shared/stores/useUserStore";

const vacationSaldoServices = new VacationSaldoServices(httpHandler);

/**
 * Hook para obtener el saldo de vacaciones del colaborador autenticado
 * (`GET .../companies/{company_id}/modules/{module_code}/collaborators/{identification_number}/vacations`).
 *
 * Los parámetros salen del store de usuario; la query solo se ejecuta cuando están definidos.
 */
export const useSaldoVacationRequest = () => {
  const { companyId, moduleCode, identificationNumber } = useUserStore();

  const GetVacationSaldoQuery = useQuery({
    queryKey: ["vacationSaldo", companyId, moduleCode, identificationNumber],
    queryFn: () =>
      vacationSaldoServices.getVacationSaldo({
        company_id: companyId,
        module_code: moduleCode,
        identification_number: identificationNumber,
      }),
    enabled: Boolean(companyId && moduleCode && identificationNumber),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  return {
    GetVacationSaldoQuery,
  };
};
