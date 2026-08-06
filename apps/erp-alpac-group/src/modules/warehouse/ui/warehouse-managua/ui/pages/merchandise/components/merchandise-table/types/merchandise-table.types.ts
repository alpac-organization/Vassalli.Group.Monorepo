import type { MerchandiseRegisterItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise";

export type MerchandiseTableProps = {
  data: MerchandiseRegisterItem[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
};
