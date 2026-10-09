import { Badges, type TableColumn } from "@alpac/design-system";
import { Trash2 } from "lucide-react";
import type { AssignmentCollaboratorDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-collaborators";
import {
  AssignmentCollaboratorRole,
  AssignmentCollaboratorRoleLabels,
} from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";

export interface GetAssignmentCollaboratorsColumnsProps {
  onDelete: (collaborator: AssignmentCollaboratorDto) => void;
  isDeleting?: boolean;
}

export function getAssignmentCollaboratorsColumns({
  onDelete,
  isDeleting,
}: GetAssignmentCollaboratorsColumnsProps): TableColumn<AssignmentCollaboratorDto>[] {
  return [
    {
      key: "collaborator_name",
      label: "Colaborador",
      render: (item) => (
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
          {item.collaborator_information?.collaborator_name || "—"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Rol en Asignación",
      render: (item) => {
        const isOperator =
          item.role === AssignmentCollaboratorRole.ForkliftOperator ||
          (item.role as unknown as number) === 2;
        return (
          <Badges
            label={
              isOperator
                ? AssignmentCollaboratorRoleLabels[
                    AssignmentCollaboratorRole.ForkliftOperator
                  ]
                : AssignmentCollaboratorRoleLabels[
                    AssignmentCollaboratorRole.WarehouseAssistant
                  ]
            }
            color="transparent"
            className={
              isOperator
                ? "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800 px-2.5! py-0.5! text-xs font-semibold"
                : "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-2.5! py-0.5! text-xs font-semibold"
            }
          />
        );
      },
    },
    {
      key: "job_position_name",
      label: "Cargo",
      render: (item) => (
        <span className="text-slate-700 dark:text-slate-200">
          {item.collaborator_information?.job_position_name || "—"}
        </span>
      ),
    },
    {
      key: "work_area_name",
      label: "Área",
      render: (item) => (
        <span className="text-slate-700 dark:text-slate-200">
          {item.collaborator_information?.work_area_name || "—"}
        </span>
      ),
    },
    {
      key: "created_by_user_name",
      label: "Asignado por",
      render: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {item.created_by_user_name || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item) => (
        <button
          type="button"
          title="Quitar colaborador"
          disabled={isDeleting}
          onClick={() => onDelete(item)}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];
}
