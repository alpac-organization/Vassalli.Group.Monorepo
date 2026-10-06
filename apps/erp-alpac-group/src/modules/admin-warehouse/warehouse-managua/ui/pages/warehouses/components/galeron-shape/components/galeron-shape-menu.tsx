import { ContextMenuButton } from "@alpac/design-system";
import type { GaleronShapeMenuProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/galeron-shape/components/galeron-shape-menu.types";
import { StackingOderMenu } from "../../stacking-order-menu/stacking-order-menu";

export const GaleronShapeMenu = ({
   menu,
   setMenu,
   onEdit,
   onAddGaleronSection,
   bringToFront,
   sendToBack,
}: GaleronShapeMenuProps) => {
   return (
      <>
         {menu && (
            <div
               className="fixed z-50 m-0! min-w-15 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:bg-[#272b34] dark:border-slate-600 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
               style={{ left: menu.x, top: menu.y }}
               onMouseDown={(event) => event.stopPropagation()}
               onClick={(event) => event.stopPropagation()}
            >
               <ContextMenuButton
                  label="Editar"
                  onClick={() => {
                     onEdit(menu.galeronData);
                     setMenu(null);
                  }}
               />

               <li
                  role="separator"
                  className="m-0 p-0 h-0 border-t border-slate-200 dark:border-slate-600"
               />

               <ContextMenuButton
                  label="Agregar tramo"
                  onClick={() => {
                     onAddGaleronSection(menu.galeronData);
                     setMenu(null);
                  }}
               />

               <li
                  role="separator"
                  className="m-0 p-0 h-0 border-t border-slate-200 dark:border-slate-600"
               />

               <StackingOderMenu
                  onBringToFront={() => {
                     bringToFront(menu.galeronNode);
                     setMenu(null);
                  }}
                  onSendToBack={() => {
                     sendToBack(menu.galeronNode);
                     setMenu(null);
                  }}
               />
            </div>
         )}
      </>
   );
};
