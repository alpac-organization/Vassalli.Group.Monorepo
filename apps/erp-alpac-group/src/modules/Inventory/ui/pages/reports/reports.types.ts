import type { LucideIcon } from "lucide-react";

export type ReportCategoryId =
  | "existences"
  | "movements"
  | "equipment-outputs";

export interface ReportCategoryMeta {
  id: ReportCategoryId;
  title: string;
  tabLabel: string;
  subtitle: string;
  icon: LucideIcon;
  accentBgClass: string;
  accentTextClass: string;
  accentRingClass: string;
}

export interface ReportCatalogItem {
  slug: string;
  categoryId: ReportCategoryId;
  title: string;
  description: string;
  actionLabel: string;
  isAvailable: boolean;
  icon: LucideIcon;
  highlights: string[];
  availableFilters: string[];
}
