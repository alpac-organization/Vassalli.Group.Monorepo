import { warehouseHttpHandler } from "@app/core/adapters";
import { SectionService } from "@app/modules/admin-warehouse/warehouse-managua/infrastructure/services/SectionService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { DeleteSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/delete-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-sections-req";
import type { RegisterSectionCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-coordinates-req";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

const sectionService = new SectionService(warehouseHttpHandler);

interface UseSectionProps {
   getSectionsPayload?: GetSectionsRequest;
   getSectionDetailsPayload?: GetSectionDetailsRequest;
}

const hasCompanyContext = (payload?: { company_id?: string; module_code?: string; }) => Boolean(payload?.company_id?.trim() && payload?.module_code?.trim());

export const useSection = (props?: UseSectionProps) => {

   const queryClient = useQueryClient();
   const { getSectionsPayload, getSectionDetailsPayload } = props || {};

   const GetSections = useQuery<GetSectionsResponse, ApiErrorResponse>({
      queryKey: ["get-warehouse-sections-records", getSectionsPayload],
      queryFn: () => sectionService.GetSections(getSectionsPayload!),
      enabled: hasCompanyContext(getSectionsPayload) &&
         Boolean(getSectionsPayload?.warehouse_id),
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const GetSectionDetails = useQuery<GetSectionDetailsResponse, ApiErrorResponse>({
      queryKey: ["get-section-details-record", getSectionDetailsPayload],
      queryFn: () => sectionService.GetSectionDetails(getSectionDetailsPayload!),
      enabled: hasCompanyContext(getSectionDetailsPayload) &&
         Boolean(
            getSectionDetailsPayload?.warehouse_id &&
            getSectionDetailsPayload?.section_id,
         ),
      refetchOnWindowFocus: false,
      retry: 1,
   });

   const RegisterSection = useMutation<void, ApiErrorResponse, RegisterSectionRequest>({
      mutationKey: ["register-section-record"],
      mutationFn: (payload) => sectionService.RegisterSection(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-warehouse-sections-records"] });
      },
      retry: 1,
   });

   const RegisterSectionCoordinates = useMutation<void, ApiErrorResponse, RegisterSectionCoordinatesRequest>({
      mutationKey: ["register-section-coordinates-record"],
      mutationFn: (payload) => sectionService.RegisterSectionCoordinates(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-section-details-record"] });
      },
      retry: 1,
   });

   const UpdateSection = useMutation<void, ApiErrorResponse, UpdateSectionRequest>({
      mutationKey: ["update-section-record"],
      mutationFn: (payload) => sectionService.UpdateSection(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-warehouse-sections-records"] });
         queryClient.invalidateQueries({ queryKey: ["get-section-details-record"] });
      },
      retry: 1,
   });

   const DeleteSection = useMutation<void, ApiErrorResponse, DeleteSectionRequest>({
      mutationKey: ["delete-section-record"],
      mutationFn: (payload) => sectionService.DeleteSection(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["get-warehouse-sections-records"] });
      },
      retry: 1,
   });

   return {
      RegisterSection,
      RegisterSectionCoordinates,
      GetSections,
      GetSectionDetails,
      UpdateSection,
      DeleteSection,
   };
};
