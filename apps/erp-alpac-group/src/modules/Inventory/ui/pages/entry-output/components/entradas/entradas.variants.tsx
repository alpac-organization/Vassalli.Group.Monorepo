import { Badges, ContextMenu } from "@alpac/design-system";
import { EntryStatus } from "@app/core/enums/entry-status.enum";
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";
import { ENTRY_STATUS_BADGE_CLASS_NAME } from "./entradas.constants";

import type { ContextMenuItem, TableColumn } from "@alpac/design-system";
import type { InventoryEntry } from "@app/modules/Inventory/domain/api-contract/responses/inventory-entries.response";
import type { ContextMenuItemsProps, InventoryEntriesColumnsToTableProps } from "./entradas.types";

export const GetInventoryEntriesColumnsToTable = function (
  props: InventoryEntriesColumnsToTableProps = {},
): TableColumn<InventoryEntry>[] {
  const { ActionsMenuContext } = props;

  const {
    onViewEntry = () => {},
  } = ActionsMenuContext ?? {};

  return [
    {
      key: "code",
      label: "Código",
      render: (item) => <span>{item.code ?? "—"}</span>,
    },
    {
      key: "entry_status",
      label: "Estado",
      render: (item) => (
        <Badges
          color="info"
          className={ENTRY_STATUS_BADGE_CLASS_NAME[item.entry_status]}
          label={EntryStatus[item.entry_status]?.label ?? ""}
        />
      ),
    },
    {
      key: "branch_information",
      label: "Sucursal",
      render: (item) => {
        const branch = item.branch_information;
        if (!branch) return <span>—</span>;
        const branchLabel = branch.branch_name ?? branch.branch_code ?? "—";

        return (
          <span>
            {branchLabel}
            {branch.branch_code ? ` (${branch.branch_code})` : ""}
          </span>
        );
      },
    },
    {
      key: "company_alias",
      label: "Alias de la compañía",
      render: (item) => <span>{item.branch_information?.company_alias ?? "—"}</span>,
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
