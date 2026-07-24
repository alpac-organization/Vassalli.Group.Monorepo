import type { RecordEntrance } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";

export type MovementsQueueProps = {
  data: RecordEntrance[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onDetailClick?: (item: RecordEntrance) => void;
};
