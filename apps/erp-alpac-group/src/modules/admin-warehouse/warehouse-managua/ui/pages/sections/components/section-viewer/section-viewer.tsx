import { useState } from "react";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { PIXELS_PER_METER, WarehouseShape } from "../../../warehouses-temp/components/warehouse-shape/warehouse-shape";
import { SECTION_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { SectionShape } from "../section-shape/section-shape";
import type { SectionViewerProps } from "./section-viewer.types";

export const SectionViewer = ({
   className,
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

   const width = 37.35;
   const length = 61.02;
   const margins = {
      top: 0.6, bottom: 0.4, left: 0.6, right: 0.6
   }

   const sectionWidth = (width - (margins.left + margins.right)) / sections.length;
   const sectionLength = (length - ((margins.top + margins.bottom)));

   return (
      <section
         className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}
      >
         <WarehouseShape
            width={width}
            length={length}
            marginTop={0.6}
            marginBottom={0.4}
            marginLeft={0.6}
            marginRight={0.6}
         >
            {sections.map((details, index) => (
               <SectionShape
                  key={details.section_id}
                  id={details.section_id}
                  code={details.section_code}
                  x={index * sectionWidth}
                  y={0}
                  width={sectionWidth}
                  length={sectionLength}
                  rotation={0}                  
                  status={details.is_active ? "available" : "maintenance"}
                  selected={activeSelectedId === details.section_id}
                  pixelsPerMeter={PIXELS_PER_METER}
                  onSelect={handleSelect}
               />
            ))}
         </WarehouseShape>

         <div className="flex gap-x-4 gap-y-1 items-center mt-2 flex-wrap">
            {SECTION_STATUS_LEGEND.map((item) => (
               <LegendItem key={item.text} text={item.text} color={item.color} />
            ))}
         </div>
      </section>
   );
};
