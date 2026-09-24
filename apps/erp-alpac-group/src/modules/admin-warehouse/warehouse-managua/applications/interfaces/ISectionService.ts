import type { DeleteSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/delete-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-sections-req";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { RegisterSectionCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-coordinates-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";

export interface ISectionService {

   RegisterSection(payload: RegisterSectionRequest): Promise<void>;

   RegisterSectionCoordinates(payload: RegisterSectionCoordinatesRequest): Promise<void>;

   GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse>;

   GetSectionDetails(payload: GetSectionDetailsRequest): Promise<GetSectionDetailsResponse>;

   UpdateSection(payload: UpdateSectionRequest): Promise<void>;

   DeleteSection(payload: DeleteSectionRequest): Promise<void>;
}
