import type { GetJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/get-job-positions";
import { JobPositionServices } from "@app/modules/admin/infrastructure/job-positions/JobPositionsServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
import type { CreateJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/create-job-positions";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetJobPositionsResponse } from "@app/modules/admin/domain/ApiContract/responses/job-positions/get-positions-response";
import type { DeleteJobPositionsRequest } from "@app/modules/admin/domain/ApiContract/requests/job_positions/delete-job-positions";

const jobPositionServices = new JobPositionServices(httpHandler);

export const useJobPositions = (payload: GetJobPositionsRequest) => {
  const queryClient = useQueryClient();

  const GetJobPositionsByCompany = useQuery<
    GetJobPositionsResponse[] | undefined,
    ApiErrorResponse
  >({
    queryKey: ["job-positions"],
    queryFn: () => jobPositionServices.getJobPositions(payload),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: Boolean(payload.company_id),
  });

  const CreateJobPosition = useMutation<
    void,
    ApiErrorResponse,
    CreateJobPositionsRequest
  >({
    mutationKey: ["register-job-position"],
    mutationFn: (payload: CreateJobPositionsRequest) =>
      jobPositionServices.registerJobPosition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
    },
  });

  const deleteJobPosition = useMutation<
    void,
    ApiErrorResponse,
    DeleteJobPositionsRequest
  >({
    mutationKey: ["delete-job-position"],
    mutationFn: (payload: DeleteJobPositionsRequest) =>
      jobPositionServices.deleteJobPosition(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-positions"] });
    },
  });

  return { GetJobPositionsByCompany, CreateJobPosition, deleteJobPosition };
};
