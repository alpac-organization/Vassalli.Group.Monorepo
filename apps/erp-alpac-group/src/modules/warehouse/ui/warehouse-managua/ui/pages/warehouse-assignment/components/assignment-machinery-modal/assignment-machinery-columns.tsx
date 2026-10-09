import { Badges, type TableColumn } from "@alpac/design-system";
import { Trash2, Truck } from "lucide-react";
import type { AssignmentMachineryDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-machinery";
import { getMachineryTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";

export interface GetAssignmentMachineryColumnsProps {
  onDelete: (machinery: AssignmentMachineryDto) => void;
  isDeleting?: boolean;
}

export function getAssignmentMachineryColumns({
  onDelete,
  isDeleting,
}: GetAssignmentMachineryColumnsProps): TableColumn<AssignmentMachineryDto>[] {
  return [
    {
      key: "machinery_code",
      label: "Código",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-100">
            {item.machinery_information?.machinery_code || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "machinery_brand",
      label: "Marca / Modelo",
      render: (item) => {
        const brand = item.machinery_information?.machinery_brand;
        const model = item.machinery_information?.machinery_model;
        const text = [brand, model].filter(Boolean).join(" ");
        return (
          <span className="text-slate-700 dark:text-slate-200">
            {text || "—"}
          </span>
        );
      },
    },
    {
      key: "machinery_type",
      label: "Tipo",
      render: (item) => (
        <Badges
          label={getMachineryTypeLabel(item.machinery_information?.machinery_type)}
          color="transparent"
          className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-2.5! py-0.5! text-xs font-semibold"
        />
      ),
    },
    {
      key: "concept",
      label: "Concepto",
      render: (item) => (
        <span className="text-slate-700 dark:text-slate-200 line-clamp-1">
          {item.concept || "—"}
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
          title="Quitar maquinaria"
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
