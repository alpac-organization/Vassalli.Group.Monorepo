
import { useQuery } from "@tanstack/react-query";
import { IncomesServices } from "@app/modules/payroll/infrastructure/services/incomes-services/IncomesServices";
import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetIncomeTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/get-income-types.request";

const incomeServices = new IncomesServices(httpHandler);

type IncomeTypesResponse = Awaited<ReturnType<typeof incomeServices.GetIncomesTypes>>;

interface useIncomesProps {
   incomesTypesPayload?: GetIncomeTypesRequest
}

export function useIncomes(props: useIncomesProps) {

   const GetIncomeTypes = useQuery<IncomeTypesResponse, ApiErrorResponse>({
      queryKey: ["incomes-types", props.incomesTypesPayload],
      queryFn: () => incomeServices.GetIncomesTypes(props.incomesTypesPayload!),
      enabled: Boolean(props.incomesTypesPayload),
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
   });

   return { GetIncomeTypes }
}