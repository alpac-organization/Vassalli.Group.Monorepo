import { useEffect, useState } from "react";
import { Button } from "@alpac/design-system";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { PIXELS_PER_METER, WarehouseShape } from "../../../warehouses-temp/components/warehouse-shape/warehouse-shape";
import { SECTION_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { SectionShape } from "../section-shape/section-shape";
import { SectionShapeMenu } from "../section-shape/components/section-shape-menu/section-shape-menu";

import type { EditMode, SectionPosition, SectionSize, SectionViewerProps } from "./section-viewer.types";
import type { SectionMenuState } from "../section-shape/components/section-shape-menu/section-shape-menu.types";
import { SaveIcon } from "lucide-react";
import type { SectionDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-sections-res";

export const SectionViewer = ({
   className,
   sections = [],
   selectedSection,
   onSelectSection,
}: SectionViewerProps) => {

   const [editMode, setEditMode] = useState<EditMode>(null);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [positions, setPositions] = useState<SectionPosition>({});
   const [sizes, setSizes] = useState<SectionSize>({});   
   const [menu, setMenu] = useState<SectionMenuState | null>(null);
   const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
   const [internalSelectedCode, setInternalSelectedCode] = useState<string | null>(null);

   const activeSelectedId = selectedSection?.section_id ?? internalSelectedId;
   const activeSelectedCode = selectedSection?.section_code ?? internalSelectedCode;
   const width = 37.35;
   const length = 61.02;
   const margins = { top: 0.6, bottom: 0.4, left: 0.6, right: 0.6 }

   const sectionWidth = (width - (margins.left + margins.right)) / sections.length;
   const sectionLength = (length - ((margins.top + margins.bottom)));

   const getPosition = (id: string, index: number) => positions[id] ?? { x: index * sectionWidth, y: 0 };
   const getSize = (id: string) => sizes[id] ?? { width: sectionWidth, length: sectionLength };

   const handleContextMenu = (next: SectionMenuState) => {
      setInternalSelectedId(next.section.section_id);
      setInternalSelectedCode(next.section.section_code);
      onSelectSection?.(next.section.section_id);
      setMenu(next);
   };

   const handleEdit = (section: SectionDto) => {
      setEditingId(section.section_id);
      setEditMode("edit");
      setInternalSelectedId(section.section_id);
      setInternalSelectedCode(section.section_code);
   }

   const handleSelect = (section: SectionDto) => {
      setInternalSelectedId(section.section_id);
      setInternalSelectedCode(section.section_code);
      onSelectSection?.(section.section_id);
      setEditMode(null);
   };

   const handleSaveOrUpdateSection = () => {

   }

   useEffect(() => {
      if (!menu) return;
      const close = () => setMenu(null);
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
   }, [menu]);

   useEffect(() => {
      if (editMode == null) return;
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            setEditMode(null);
            setEditingId(null);
         }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
   }, [editMode]);

   return (
      <section className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}>

         <div className="flex lg:justify-between items-center mb-4 flex-wrap">
            <div>
               <h4 className="font-bold m-0! p-0!">Plano de la bodega</h4>
               <span className="text-sm text-gray-400 m-0! p-0!">Sección seleccionada: {activeSelectedCode}</span>               
            </div>
            {editMode == "edit" && <Button
               type="button"
               size="giant"
               label="Guardar cambios"
               icon={<SaveIcon size={20} />}
               className="w-full! lg:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
               onClick={handleSaveOrUpdateSection}
            />}
         </div>

         <WarehouseShape
            width={width}
            length={length}
            draggable={editMode == null}
            marginTop={0.6}
            marginBottom={0.4}
            marginLeft={0.6}
            marginRight={0.6}
         >
            {sections.map((section, index) => (
               <SectionShape
                  key={section.section_id}
                  section={section}
                  x={getPosition(section.section_id, index).x}
                  y={getPosition(section.section_id, index).y}
                  width={getSize(section.section_id).width}
                  length={getSize(section.section_id).length}
                  rotation={0}
                  status={section.is_active ? "available" : "maintenance"}
                  selected={activeSelectedId === section.section_id}
                  pixelsPerMeter={PIXELS_PER_METER}
                  draggable={editMode === "edit" && editingId === section.section_id}
                  resizable={editMode === "edit" && editingId === section.section_id}
                  onSelect={handleSelect}
                  onContextMenu={handleContextMenu}
                  onPositionChange={(id, x, y) => setPositions((prev) => ({ ...prev, [id]: { x, y } }))}
                  onResizeChange={(id, width, length) => setSizes((prev) => ({ ...prev, [id]: { width, length } }))}
               />
            ))}
         </WarehouseShape>

         <SectionShapeMenu
            menu={menu}
            setMenu={setMenu}
            onEdit={handleEdit}
         />

         <div className="flex gap-x-4 gap-y-1 items-center justify-between mt-2 flex-wrap">
            <div className="flex gap-x-4 gap-y-1 items-center flex-wrap">
               {SECTION_STATUS_LEGEND.map((item) => (
                  <LegendItem key={item.text} text={item.text} color={item.color} />
               ))}
            </div>
         </div>
      </section>
   );
};
