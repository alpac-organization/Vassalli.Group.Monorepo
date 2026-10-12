import { useMemo, useState } from "react";
import {
  Badges,
  Button,
  DataTable,
  Modal,
  Pagination,
  type TableColumn,
} from "@alpac/design-system";
import dayjs from "dayjs";
import { Package, Target } from "lucide-react";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { AssignmentOperationalDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignments";
import { AssignmentOperationalStatus } from "@app/modules/warehouse/domain/ApiContract/Requests/warehouse-requests/warehouse-managua/warehouse-assignment/assignment-enums";
import {
  getAssignmentStatusBadgeProps,
  getDestinationLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";

interface DescargueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignPositions: (assignment: AssignmentOperationalDto) => void;
}

const PAGE_SIZE = 10;

export function DescargueModal({
  isOpen,
  onClose,
  onAssignPositions,
}: DescargueModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const [pageNumber, setPageNumber] = useState(1);

  // Consulta de asignaciones con status Pending (1) y sin operational_order_id
  const { GetAssignments } = useWarehouseAssignment({
    payloadAssignments:
      isOpen && companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            page_number: pageNumber,
            page_size: PAGE_SIZE,
            status: AssignmentOperationalStatus.Pending,
          }
        : null,
  });

  const { data: assignmentsData, isLoading, isFetching } = GetAssignments;
  const assignmentsList = assignmentsData?.data ?? [];

  const columns = useMemo<TableColumn<AssignmentOperationalDto>[]>(() => {
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
        key: "operational_order_id",
        label: "Orden Operacional",
        render: (item) => (
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            {item.operational_order_id
              ? item.operational_order_id.slice(0, 13) + "..."
              : "—"}
          </span>
        ),
      },
      {
        key: "destination_type",
        label: "Destino",
        render: (item) => (
          <span className="text-xs text-slate-700 dark:text-slate-200">
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
        key: "created_at",
        label: "Fecha",
        render: (item) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {item.created_at
              ? dayjs(item.created_at).format("DD/MM/YYYY HH:mm")
              : "—"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Acción",
        render: (item) => (
          <Button
            type="button"
            size="small"
            label="Asignar posiciones"
            icon={<Target size={14} />}
            onClick={() => onAssignPositions(item)}
            className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 whitespace-nowrap cursor-pointer"
          />
        ),
      },
    ];
  }, [onAssignPositions]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="5xl"
      title="Descargue de Mercancía · Asignaciones Pendientes"
      description="Selecciona una asignación pendiente para ubicar sus posiciones de almacenamiento en la bodega 3D."
      panelClassName="flex max-h-[min(94dvh,52rem)] flex-col overflow-hidden !mx-2 !my-2 sm:!mx-4 sm:!my-6 rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 mt-2">
        {isLoading ? (
          <div className="px-3 py-16 text-center">
            <Loader title="Cargando asignaciones pendientes..." />
          </div>
        ) : assignmentsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-500 dark:text-slate-400">
            <Package size={48} className="text-slate-400 opacity-60" />
            <p className="text-sm font-medium">
              No hay asignaciones pendientes de descargue en este momento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 min-h-0 flex-1 overflow-auto">
            <DataTable
              title="Asignaciones Pendientes de Ubicación"
              data={assignmentsList}
              columns={columns}
              pagination={
                <Pagination
                  currentPage={assignmentsData?.page_number ?? pageNumber}
                  pageSize={assignmentsData?.page_size ?? PAGE_SIZE}
                  totalRecords={assignmentsData?.total ?? 0}
                  onPageChange={setPageNumber}
                  disabled={isFetching}
                />
              }
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

