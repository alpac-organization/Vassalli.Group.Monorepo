import type { DataAccessControl } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export type MovementsQueueProps = {
  data: DataAccessControl[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onDetailClick?: (item: DataAccessControl) => void;
};
