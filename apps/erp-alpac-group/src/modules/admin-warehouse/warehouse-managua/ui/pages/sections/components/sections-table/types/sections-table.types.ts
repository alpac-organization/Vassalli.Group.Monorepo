import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export type SectionsTableProps = {
  data: SectionDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onViewLots: (section: SectionDto) => void;
  onViewRacks: (section: SectionDto) => void;
  isFetching?: boolean;
};

export type SectionsColumnsOptions = {
  onViewLots: (section: SectionDto) => void;
  onViewRacks: (section: SectionDto) => void;
  lastItemId?: string;
};
