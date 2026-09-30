import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";
import type { Dispatch, SetStateAction } from "react";

export type SectionMenuState = {
   x: number;
   y: number;
   section: SectionDto
};

export interface SectionShapeMenuProps {
   menu: SectionMenuState | null;
   setMenu: Dispatch<SetStateAction<SectionMenuState | null>>;   
   onEdit: (section: SectionDto) => void;
}