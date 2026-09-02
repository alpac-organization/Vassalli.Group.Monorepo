import { useQuery } from "@tanstack/react-query"
import { warehouseHttpHandler } from "@app/core/adapters";
import { MerchandiseUnloadingServices } from "@app/modules/warehouse/infrastructure/services/merchandise-unloading-services/merchandise-unloading-services";
import type { PendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";

type UseMerchandiseUnloading = {
    payloadGetPendingAssignments?: PendingAssignmentsRequest;
};

const merchandiseUnloadingServices = new MerchandiseUnloadingServices(warehouseHttpHandler);

export const useMerchandiseUnloading = function(props?: UseMerchandiseUnloading) {
    
    const { 
        payloadGetPendingAssignments
    } = props ?? {};

    const GetPendingAssignmentsQuery = useQuery({
        queryKey: ["merchandise-unloading", payloadGetPendingAssignments],
        queryFn: () => merchandiseUnloadingServices.GetPendingAssignmentsAsync(payloadGetPendingAssignments as PendingAssignmentsRequest),
        enabled: true,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    return {
        GetPendingAssignmentsQuery
    }
}