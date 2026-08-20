import type { ReceptionEntranceListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export type MovementsQueueProps = {
  data: ReceptionEntranceListItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onDetailClick?: (item: ReceptionEntranceListItem) => void;
  onExitClick?: (item: ReceptionEntranceListItem) => void;
  onDeleteClick?: (item: ReceptionEntranceListItem) => void;
};
