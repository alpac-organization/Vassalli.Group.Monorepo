import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { Position, Size } from "../../../warehouses-temp/components/warehouse-shape/warehouse-shape.types";

export interface SectionViewerProps {
  className?: string;
  sections?: SectionDto[];
  selectedSection?: SectionDto;  
  onSelectSection?: (sectionId: string) => void;
}

export type EditMode = "edit" | null;

export type SectionPosition = Record<string, Position>;

export type SectionSize = Record<string, Size>;