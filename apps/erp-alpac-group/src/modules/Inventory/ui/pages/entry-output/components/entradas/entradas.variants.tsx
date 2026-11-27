import { Badges, ContextMenu } from "@alpac/design-system";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { EntryTypeEnum } from "@app/core/enums/entry-type.enum";
import { formatBranchDisplay } from "@app/shared/utils/branch-display.utils";
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

import type { ContextMenuItem, TableColumn } from "@alpac/design-system";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { ContextMenuItemsProps, InventoryEntriesColumnsToTableProps } from "./entradas.types";
import { formatSpanishDateTime } from "@app/shared/utils/date.utils";

export const GetInventoryEntriesColumnsToTable = function (props: InventoryEntriesColumnsToTableProps = {}): TableColumn<InventoryEntry>[] {
  
   const { ActionsMenuContext } = props;
   const {
      canAnnulEntry = false,
      onViewEntry = () => {},
      onRegisterEntry = () => {},
      onAnnulEntry = () => {},
   } = ActionsMenuContext ?? {};

   return [
      {
         key: "code",
         label: "Código de entrada",
         render: (item) => <span>{item.code ?? "—"}</span>,
      },
      {
         key: "entry_status",
         label: "Estado",
         render: (item) => (
            <Badges
               color="info"
               className={EntryStatus[item.entry_status].badgeColor}
               label={EntryStatus[item.entry_status]?.label ?? ""}
            />
         ),
      },
      {
         key: "entry_type",
         label: "Tipo Entrada",
         render: (item) => (
            <Badges
               color="info"
               className={EntryTypeEnum[item.entry_type ?? "Buy"]?.badgeColor ?? ""}
               label={EntryTypeEnum[item.entry_type ?? "Buy"]?.label ?? ""}
            />
         ),
      },
      {
         key: "branch_name",
         label: "Sucursal",
         render: (item) => {
            const branchDisplay = formatBranchDisplay(item.branch_information);
            return (
               <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                     {branchDisplay.primary}
                  </span>
                  {branchDisplay.secondary && (
                     <span className="text-xs text-slate-500 dark:text-slate-400">
                        {branchDisplay.secondary}
                     </span>
                  )}
               </div>
            );
         },
      },
      {
         key: "work_area_name",
         label: "Area de trabajo",
         render: (item) => (
            <span>{item.work_area_information?.work_area_name ?? ""}</span>
         ),
      },
      {
         key: "created_at",
         label: "Fecha",
         render: (item) => {
            const datePart = item.created_at ? item.created_at.slice(0, 10)  : "";
            const timePart = item.created_at ? item.created_at.slice(11, 19) : "";
            return <span>{formatSpanishDateTime(datePart, timePart)}</span>;
         }
      },
      {
         key: "options",
         label: "Acciones",
         render(item) {
            const contextMenuItems = GetContextMenuItems({
               item,
               canAnnulEntry,
               onViewEntry,
               onRegisterEntry,
               onAnnulEntry,
            });

            return (
               <ContextMenu
                  triggerClassName={contextMenuButton}
                  items={contextMenuItems}
                  openUpOnMobile
               />
            );
         },
      },
   ];
};

const GetContextMenuItems = function (props: ContextMenuItemsProps): ContextMenuItem[] {
   const {
      item,
      canAnnulEntry = false,
      onViewEntry = () => {},
      onRegisterEntry = () => {},
      onAnnulEntry = () => {},
   } = props;

   const items: ContextMenuItem[] = [
      {
         label: "Ver detalle",
         onClick() {
            onViewEntry(item);
         },
      },
   ];

   if (EntryStatus[item.entry_status]?.value === EntryStatus.PendingReview.value) {
      items.push({
         label: "Registrar entrada",
         onClick() {
            onRegisterEntry(item);
         },
      });

      if (canAnnulEntry) {
         items.push({
            label: "Anular entrada",
            onClick() {
               onAnnulEntry(item);
            },
         });
      }
   }

   return items;
};
