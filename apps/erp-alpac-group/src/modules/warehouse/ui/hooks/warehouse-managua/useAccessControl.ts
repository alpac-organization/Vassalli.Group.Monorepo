import type { GetAccessControlRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/access-control/get-access-control";
import { AccessControlServices } from "@app/modules/warehouse/infrastructure/services/warehouse-services/warehouse-managua/AccessControlServices";
import { useQuery } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters/axiosAdapter";
import type { GetAccessControlResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

type UseAccessControlProps = {
  payload: GetAccessControlRequest;
};
const warehouseManaguaServices = new AccessControlServices(
  warehouseHttpHandler,
);
export const useAccessControl = (props: UseAccessControlProps) => {
  const { payload } = props;
  const GetAccessControl = useQuery<GetAccessControlResponse, ApiErrorResponse>(
    {
      queryKey: ["access-control", payload],
      queryFn: () => warehouseManaguaServices.getAccessControl(payload),
      enabled: Boolean(payload.company_id && payload.module_code),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  );
  return {
    GetAccessControl,
  };
};
