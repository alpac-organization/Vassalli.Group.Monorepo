import type { DeleteSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/delete-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";
import type { GetSectionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-sections-req";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { GetPositionsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-positions-req";
import type { RegisterCoordinatesRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-coordinates-req";
import type { UpdateSectionLayoutRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-layout-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { GetSectionDetailsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-section-details-res";
import type { GetPositionsResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-positions-res";

export interface ISectionService {

   RegisterSection(payload: RegisterSectionRequest): Promise<void>;

   RegisterCoordinates(payload: RegisterCoordinatesRequest): Promise<void>;

   GetSections(payload: GetSectionsRequest): Promise<GetSectionsResponse>;

   GetSectionDetails(payload: GetSectionDetailsRequest): Promise<GetSectionDetailsResponse>;

   GetPositions(payload: GetPositionsRequest): Promise<GetPositionsResponse>;

   UpdateSection(payload: UpdateSectionRequest): Promise<void>;

   UpdateSectionLayout(payload: UpdateSectionLayoutRequest): Promise<void>;

   DeleteSection(payload: DeleteSectionRequest): Promise<void>;
}
