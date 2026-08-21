import type { SectionResponse } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/get-section-res";

export type SectionsTableProps = {
  data: SectionResponse[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewLots: (section: SectionResponse) => void;
  onViewRacks: (section: SectionResponse) => void;
  isFetching?: boolean;
};

export type SectionsColumnsOptions = {
  onViewLots: (section: SectionResponse) => void;
  onViewRacks: (section: SectionResponse) => void;
  lastItemId?: string;
};
