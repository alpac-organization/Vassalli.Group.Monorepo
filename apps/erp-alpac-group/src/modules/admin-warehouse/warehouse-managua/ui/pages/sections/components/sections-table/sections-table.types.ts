import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export type SectionsTableProps = {
  data: SectionDto[];
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  isFetching?: boolean;
  height?: number | string,
  minHeight?: number | string,
  maxHeight?: number | string,
  selectedSection?: SectionDto | null;
  onSelectRow: (section: SectionDto) => void;
  onPageChange: (page: number) => void;
  onViewLots: (section: SectionDto) => void;
  onViewRacks: (section: SectionDto) => void;
  onUpdateSection: (section: SectionDto) => void;
  onDeleteSection: (section: SectionDto) => void;  
};

export type SectionsColumnsOptions = {
  onViewLots: (section: SectionDto) => void;
  onViewRacks: (section: SectionDto) => void;
  onUpdateSection: (section: SectionDto) => void;
  onDeleteSection: (section: SectionDto) => void;  
  lastItemId?: string;
};
