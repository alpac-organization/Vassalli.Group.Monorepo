import { Badges, ContextMenu } from "@alpac/design-system";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { EntryTypeEnum } from "@app/core/enums/entry-type.enum";
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

import type { ContextMenuItem, TableColumn } from "@alpac/design-system";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { ContextMenuItemsProps, InventoryEntriesColumnsToTableProps } from "./entradas.types";

export const GetInventoryEntriesColumnsToTable = function (props: InventoryEntriesColumnsToTableProps = {}): TableColumn<InventoryEntry>[] {
  
   const { ActionsMenuContext } = props;
   const { onViewEntry = () => {} } = ActionsMenuContext ?? {};

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
         render: (item) => (
            <span>{item.branch_information?.branch_name ?? ""}</span>
         ),
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
         render: (item) => (
            <span>{item.created_at}</span>
         ),
      },
      {
         key: "options",
         label: "Acciones",
         render(item) {
            const contextMenuItems = GetContextMenuItems({
               item,
               onViewEntry,
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
      onViewEntry = () => {},
   } = props;

   return [
      {
         label: "Ver detalle",
         onClick() {
            onViewEntry(item);
         },
      },
   ];
};
