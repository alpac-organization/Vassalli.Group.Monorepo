import { Badges, Button, DataTable, type TableColumn } from "@alpac/design-system"
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response"
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum"
import { statusBadgeColor } from "./utils/status-badge.utils"
import { PermitApplicationStatusEnum } from "@app/modules/applications/domain/enums/permit-application-status.enum"
import type { ApplicationsTableProps } from "./applications-table.types"

export const ApplicationsTable = ({ data, pagination, onOpenApplicationDetailModal }: ApplicationsTableProps) => {


   const columns: TableColumn<GetApplicationsResponse>[] = [
      { key: 'collaborator_code', label: 'Código de Colaborador' },
      { key: 'requested_by', label: 'Solicitado por' },
      {
         key: 'type',
         label: 'Tipo',
         render: (value) => PermitApplicationTypeEnum[value.type]?.label ?? "-"
      },
      {
         key: 'status',
         label: 'Estado',
         render: (value) => (
            <Badges
               label={PermitApplicationStatusEnum[value.status]?.label ?? "-"}
               color={statusBadgeColor(value.status)} />
         )
      },
      {
         key: 'actions',
         label: 'Acciones',
         render: (value) => (
            <Button
               label="Ver Solicitud"
               size="small"
               className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
               onClick={() => onOpenApplicationDetailModal(value)}
            />
         )
      },
   ]

   return (
      <DataTable
         title="Solicitudes de permisos"
         data={data}
         columns={columns}
         pagination={pagination}
      />
   )
}