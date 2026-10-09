import type { RackStatusEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/rack-status";
import type { SectionStorageTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { SectionTypeEnum } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import type { WarehouseTypeEnum } from "@app/modules/warehouse/domain/enums/warehouse.enum";
import type { DestinationType } from "../../../../Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";


export interface warehouse_information {
    code:           string;
    warehouse_id:   string;
    warehouse_type: WarehouseTypeEnum;
}

export interface operational_order_information {
  po_code:              string | null;
  is_alerted:           boolean;
  packages_count:       number | null;
  operational_order_id: string;
}

export interface section_information {
  code:                 string | null;
  is_active:            boolean;
  section_type:         SectionTypeEnum;
  section_storage_type: SectionStorageTypeEnum;
}

export interface position_base {
  position_code: string | null;
  row:           number;
  column:        number;
  level:         number;
}

export interface rack_location_information extends position_base {
  status: RackStatusEnum;
}

export interface lot_position_information extends position_base {
  status: RackStatusEnum;
}

export interface assignment_stock_placements_information {
  section_information: section_information | null;
  lot_position_information: lot_position_information | null;
  rack_position_information: rack_location_information | null;
}

export interface AssignmentDetailsByCode {
  created_at:                               string;
  merchandise:                              string | null;
  destination_type:                         DestinationType;
  warehouse_information:                    warehouse_information | null;
  merchandise_description:                  string | null;
  operational_order_information:            operational_order_information | null;
  assignment_stock_placements_information:  assignment_stock_placements_information[];
}