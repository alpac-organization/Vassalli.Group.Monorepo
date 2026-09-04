import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseHttpHandler } from "@app/core/adapters";
import { MerchandiseUnloadingServices } from "@app/modules/warehouse/infrastructure/services/merchandise-unloading-services/merchandise-unloading-services";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { PendingAssignmentsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-pending-assignments.request";
import type { GetAssignmentDetailsRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/get-assignment-details.request";
import type { GetAssignmentDetailsResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-assignment-details.response";
import type { StartUnloadingRequest } from "@app/modules/warehouse/domain/ApiContract/Requests/merchandise-unloading/start-unloading-process.request";
import type { PagedResponse } from "@app/core/interfaces/PagedResponse";
import type { PendingAssignment } from "@app/modules/warehouse/domain/ApiContract/Responses/merchandise-unloading/get-pending-assignments.response";

type UseMerchandiseUnloading = {
    payloadGetPendingAssignments?: PendingAssignmentsRequest;
    payloadGetUnloadingAssignmentDetails?: GetAssignmentDetailsRequest;
};

const merchandiseUnloadingServices = new MerchandiseUnloadingServices(warehouseHttpHandler);

export const useMerchandiseUnloading = function (props?: UseMerchandiseUnloading) {

    const {
        payloadGetPendingAssignments,
        payloadGetUnloadingAssignmentDetails,
    } = props ?? {};

    const queryClient = useQueryClient();

    const pendingAssignmentsEnabled = Boolean(
        payloadGetPendingAssignments?.company_id?.trim() &&
        payloadGetPendingAssignments?.module_code?.trim(),
    );

    const assignmentDetailsEnabled = Boolean(
        payloadGetUnloadingAssignmentDetails?.company_id?.trim() &&
        payloadGetUnloadingAssignmentDetails?.module_code?.trim() &&
        payloadGetUnloadingAssignmentDetails?.assignment_id?.trim(),
    );

    const GetPendingAssignmentsQuery = useQuery<PagedResponse<PendingAssignment>, ApiErrorResponse>({
        queryKey: ["merchandise-unloading", payloadGetPendingAssignments],
        queryFn: () => merchandiseUnloadingServices.GetPendingAssignmentsAsync(payloadGetPendingAssignments as PendingAssignmentsRequest),
        enabled: pendingAssignmentsEnabled,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    const GetUnloadingAssignmentDetailsQuery = useQuery<GetAssignmentDetailsResponse, ApiErrorResponse>({
        queryKey: ["merchandise-unloading-details", payloadGetUnloadingAssignmentDetails],
        queryFn: () => merchandiseUnloadingServices.GetUnloadingAssignmentDetails(payloadGetUnloadingAssignmentDetails as GetAssignmentDetailsRequest),
        enabled: assignmentDetailsEnabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    const StartUnloadingProcess = useMutation<void, ApiErrorResponse, StartUnloadingRequest>({
        mutationKey: ["start-unloading"],
        mutationFn: (payload) => merchandiseUnloadingServices.StartUnloading(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["merchandise-unloading"] });
            queryClient.invalidateQueries({ queryKey: ["merchandise-unloading-details"] });
        },
        retry: 1,
    });

    return {
        GetPendingAssignmentsQuery,
        GetUnloadingAssignmentDetailsQuery,
        StartUnloadingProcess,
    };
};
