
import { Badges, ContextMenu, type ContextMenuItem, type TableColumn } from "@alpac/design-system";
import type { FaultDto } from "@app/modules/payroll/domain/ApiContract/Responses/disciplinary-responses/get-faults.response";
import { FaultSeverityEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-severity.enum";
import { FaultSourceEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-source.enum";
import { FaultStatusEnum } from "@app/modules/payroll/domain/enums/disciplinary-enums/fault-status.enum";

import {
   getFaultSeverityBadgeClass,
   getFaultSourceBadgeClass,
   getFaultStatusBadgeClass,
} from "@app/modules/payroll/ui/pages/disciplinary-management/utils/disciplinary-labels.utils";
import { formatDateToSpanishWords } from "@app/shared/utils/string.utils";
import type { FaultTableActions } from "./faults-table.types";

const contextMenuButton =
   "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";

export const faultTableColumns = ({
   onViewDetail,
   onCancel,
   canWrite = true,
}: FaultTableActions): TableColumn<FaultDto>[] => [
      {
         key: "collaborator_name",
         label: "Colaborador",
         render: (row) => row.collaborator_name?.trim() || "—",
      },
      {
         key: "fault_catalog",
         label: "Falta",
         render: (row) => (
            <span className="text-neutral-700 dark:text-neutral-300">
               {row.fault_catalog?.code
                  ? `${row.fault_catalog.code} — ${row.fault_catalog.name}`
                  : "—"}
            </span>
         ),
      },
      {
         key: "occurrence_date",
         label: "Fecha de Ocurrencia",
         render: (row) => formatDateToSpanishWords(row.occurrence_date) || "—",
      },
      {
         key: "severity",
         label: "Severidad",
         render: (row) => (
            <Badges
               label={FaultSeverityEnum[row.severity]?.label ?? String(row.severity)}
               color="transparent"
               className={getFaultSeverityBadgeClass(row.severity)}
            />
         ),
      },
      {
         key: "source",
         label: "Origen",
         render: (row) => (
            <Badges
               label={FaultSourceEnum[row.source]?.label ?? String(row.source)}
               color="transparent"
               className={getFaultSourceBadgeClass(row.source)}
            />
         ),
      },
      {
         key: "status",
         label: "Estado",
         render: (row) => (
            <Badges
               label={FaultStatusEnum[row.status]?.label ?? String(row.status)}
               color="transparent"
               className={getFaultStatusBadgeClass(row.status)}
            />
         ),
      },
      {
         key: "actions",
         label: "Acciones",
         render: (row: FaultDto) => {

            const items: ContextMenuItem[] = [
               {
                  label: "Ver detalle",
                  onClick: () => onViewDetail(row),
               },
            ];

            if (canWrite && row.status === "Open") {
               items.push({
                  label: "Anular falta",
                  onClick: () => onCancel(row),
               });
            }

            return (
               <ContextMenu
                  items={items}
                  triggerClassName={contextMenuButton}
               />
            );
         },
      },
   ];