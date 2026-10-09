import {
  Badges,
  ContextMenu,
  type ContextMenuItem,
  type TableColumn,
} from "@alpac/design-system";
import dayjs from "dayjs";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import {
  canSendAssignmentToUnloading,
  getAssignmentStatusBadgeProps,
  getDestinationLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";
import { contextMenuButton } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";


export interface GetAssignmentsListColumnsProps {
  onViewDetail: (assignment: AssignmentOperationalDto) => void;
  onEdit: (assignment: AssignmentOperationalDto) => void;
  onDelete: (assignment: AssignmentOperationalDto) => void;
  onManageCollaborators: (assignment: AssignmentOperationalDto) => void;
  onManageMachinery: (assignment: AssignmentOperationalDto) => void;
  onSendToUnloading: (assignment: AssignmentOperationalDto) => void;
}

export function getAssignmentsListColumns({
  onViewDetail,
  onEdit,
  onDelete,
  onManageCollaborators,
  onManageMachinery,
  onSendToUnloading,
}: GetAssignmentsListColumnsProps): TableColumn<AssignmentOperationalDto>[] {
  return [
    {
      key: "merchandise",
      label: "Mercancía",
      render: (item) => {
        const description = item.merchandise_description;
        return (
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {item.merchandise || "Sin especificar"}
              </span>
              {item.is_alerted && (
                <Badges
                  label="!"
                  color="danger"
                  className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800 px-1.5! py-0.2! text-[11px] font-bold"
                />
              )}
            </div>
            {description && (
              <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {description}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "destination_type",
      label: "Destino",
      render: (item) => (
        <span className="text-slate-700 dark:text-slate-200">
          {getDestinationLabel(item.destination_type)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (item) => {
        const badge = getAssignmentStatusBadgeProps(item.status);
        return (
          <Badges
            label={badge.label}
            color="transparent"
            className={badge.className}
          />
        );
      },
    },
    {
      key: "resources",
      label: "Recursos Asignados",
      render: (item) => {
        const hasMachinery = Boolean(item.has_machinery_assigned);
        const hasCollaborators = Boolean(item.has_collaborators_assigned);

        if (!hasMachinery && !hasCollaborators) {
          return (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">
              Sin recursos
            </span>
          );
        }

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {hasMachinery && (
              <Badges
                label="Maquinaria"
                color="transparent"
                className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-2! py-0.5! text-xs font-medium"
              />
            )}
            {hasCollaborators && (
              <Badges
                label="Colaboradores"
                color="transparent"
                className="bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800 px-2! py-0.5! text-xs font-medium"
              />
            )}
          </div>
        );
      },
    },
    {
      key: "created_at",
      label: "Fecha",
      render: (item) => {
        const date = item.created_at;
        return (
          <span className="text-xs text-slate-600 dark:text-slate-300">
            {date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "—"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => {
        const canSendToUnloading = canSendAssignmentToUnloading(item.status);

        const items: ContextMenuItem[] = [
          {
            label: "Ver detalle",
            onClick: () => onViewDetail(item),
          },
          {
            label: "Editar asignación",
            onClick: () => onEdit(item),
          },
          {
            label: "Gestionar maquinaria",
            onClick: () => onManageMachinery(item),
          },
          {
            label: "Gestionar colaboradores",
            onClick: () => onManageCollaborators(item),
          },
          ...(canSendToUnloading
            ? [
                {
                  label: "Enviar a Bodega",
                  onClick: () => onSendToUnloading(item),
                },
              ]
            : []),
          {
            label: "Eliminar asignación",
            onClick: () => onDelete(item),
          },
        ];

        return (
          <ContextMenu items={items} triggerClassName={contextMenuButton} />
        );
      },
    },
  ];
}
