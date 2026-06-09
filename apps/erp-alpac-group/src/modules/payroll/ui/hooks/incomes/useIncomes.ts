import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IncomesServices } from "@app/modules/payroll/infrastructure/services/incomes-services/IncomesServices";
import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetIncomeTypesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/get-income-types.request";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";

const incomeServices = new IncomesServices(httpHandler);

type IncomeTypesResponse = Awaited<
  ReturnType<typeof incomeServices.GetIncomesTypes>
>;

interface useIncomesProps {
  incomesTypesPayload?: GetIncomeTypesRequest;
}

export function useIncomes(props?: useIncomesProps) {

  const queryClient = useQueryClient();

  const GetIncomeTypes = useQuery<IncomeTypesResponse, ApiErrorResponse>({
    queryKey: ["incomes-types", props?.incomesTypesPayload],
    queryFn: () => incomeServices.GetIncomesTypes(props!.incomesTypesPayload!),
    enabled: Boolean(props?.incomesTypesPayload),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const CreateIncome = useMutation<void, ApiErrorResponse, CreateIncomeRequest>(
    {
      mutationFn: (payload: CreateIncomeRequest) => incomeServices.CreateIncome(payload),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            "detailsPayroll",
            variables.company_id,
            variables.module_code,
          ],
        });
      },
    },
  );

  return { GetIncomeTypes, CreateIncome };
}
