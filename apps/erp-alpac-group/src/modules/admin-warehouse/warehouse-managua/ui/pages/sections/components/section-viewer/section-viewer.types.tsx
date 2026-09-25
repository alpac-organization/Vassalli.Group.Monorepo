import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export interface SectionViewerProps {
  className?: string;  
  sections?: SectionDto[];
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}
