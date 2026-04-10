import { Badges, Button, DataTable, type TableColumn } from "@alpac/design-system"
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response"
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum"
import { formatDate } from "@app/shared/utils/string.utils"
import { statusBadgeColor } from "./utils/status-badge.utils"
import { PermitApplicationStatusEnum } from "@app/modules/applications/domain/enums/permit-application-status.enum"
import { useNavigate } from "react-router-dom"

export const ApplicationsTable = ({ data, pagination }: { data: GetApplicationsResponse[], pagination?: React.ReactNode }) => {

   const navigate = useNavigate();

   const columns: TableColumn<GetApplicationsResponse>[] = [
      { key: 'collaborator_code', label: 'Código de Colaborador' },
      { key: 'requested_by', label: 'Solicitado por' },
      {
         key: 'type',
         label: 'Tipo',
         render: (value) => PermitApplicationTypeEnum[value.type].label ?? "-"
      },
      {
         key: 'start_date',
         label: 'Fecha Inicio',
         render: (value) => formatDate(value.start_date)
      },
      {
         key: 'end_date',
         label: 'Fecha Fin',
         render: (value) => formatDate(value.end_date)
      },
      {
         key: 'status',
         label: 'Estado',
         render: (value) => (
            <Badges
               label={PermitApplicationStatusEnum[value.status].label ?? "-"}
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
               onClick={() => {
                  navigate('application-detail', {
                     state: { ...value } satisfies GetApplicationsResponse,
                  });
               }}
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