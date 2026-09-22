import { useState } from "react";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { PIXELS_PER_METER, WarehouseViewer } from "../../../warehouses-temp/components/warehouse-viewer/warehouse-viewer";
import { SECTION_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { SectionShape } from "../section-shape/section-shape";
import type { SectionViewerProps } from "./section-viewer.types";

export const SectionViewer = ({
   className,
   companyId,
   moduleCode,
   warehouseId,
   sections = [],
   selectedSectionId = null,
   onSelectSection,
}: SectionViewerProps) => {

   const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
   const activeSelectedId = selectedSectionId ?? internalSelectedId;

   const handleSelect = (sectionId: string) => {
      setInternalSelectedId(sectionId);
      onSelectSection?.(sectionId);
   };

   return (
      <section
         className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}
      >
         <WarehouseViewer
            width={37.35}
            length={61.02}
            marginTop={0.6}
            marginBottom={0.6}
            marginLeft={0.6}
            marginRight={0.6}
         >
            {sections.map((details) => (
               <SectionShape
                  key={details.section_id}
                  id={details.section_id}
                  code={details.section_code}
                  x={0}
                  y={0}
                  width={10}
                  length={10}
                  rotation={0}
                  status={details.is_active ? "available" : "maintenance"}
                  selected={activeSelectedId === details.section_id}
                  pixelsPerMeter={PIXELS_PER_METER}
                  onSelect={handleSelect}
               />
            ))}
         </WarehouseViewer>

         <div className="flex gap-4 items-center mt-2">
            {SECTION_STATUS_LEGEND.map((item) => (
               <LegendItem key={item.text} text={item.text} color={item.color} />
            ))}
         </div>
      </section>
   );
};
