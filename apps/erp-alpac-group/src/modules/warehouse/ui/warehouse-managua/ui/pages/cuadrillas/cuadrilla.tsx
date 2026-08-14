import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Alert, AnimatedAlertWrapper, Badges } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { MachineryTypeEnum } from "@app/modules/warehouse/domain/enums/machinery-type.enum";
import { useWarehouseAllocation } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useWarehouseAllocation";
import { AssignmentsTable } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignments-table/assignments-table";
import { AssignmentDetailModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-allocation/components/assignment-detail-modal/assignment-detail-modal";
import type { WarehouseAssignmentListItem } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-allocation/get-warehouse-assignments";
import { Loader } from "@app/shared/components/loaders/loader";

const PAGE_SIZE = 10;

function resolveMachineryTypeLabel(value: number): string {
  const option = Object.values(MachineryTypeEnum).find((o) => o.value === value);
  return option?.label ?? "—";
}

export function CuadrillaPage() {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [detailReceptionId, setDetailReceptionId] = useState<string | null>(
    null,
  );

  const catalogPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
    }),
    [companyId, moduleCode],
  );

  const assignmentsPayload = useMemo(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      page_number: assignmentsPage,
      page_size: PAGE_SIZE,
    }),
    [companyId, moduleCode, assignmentsPage],
  );

  const detailPayload = useMemo(
    () =>
      detailReceptionId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            reception_id: detailReceptionId,
          }
        : null,
    [companyId, moduleCode, detailReceptionId],
  );

  const {
    GetWarehouseAssignments,
    GetWarehouseAssignmentDetail,
    GetWarehouseStaffs,
    GetWarehouseMachineries,
    CreateUnloadingCrew,
    CreateUnloadingMachinery,
    CompleteWarehouseAssignment,
  } = useWarehouseAllocation({
    assignmentsPayload,
    detailPayload,
    machineriesPayload: catalogPayload,
    staffsPayload: catalogPayload,
  });

  const assignmentItems = GetWarehouseAssignments.data?.data ?? [];
  const assignmentsTotal = GetWarehouseAssignments.data?.total_count ?? 0;
  const detail = GetWarehouseAssignmentDetail.data ?? null;
  const staffs = Array.isArray(GetWarehouseStaffs.data)
    ? GetWarehouseStaffs.data
    : [];
  const machineries = Array.isArray(GetWarehouseMachineries.data)
    ? GetWarehouseMachineries.data
    : [];

  const handleDetailClick = useCallback((item: WarehouseAssignmentListItem) => {
    setDetailReceptionId(item.reception_id);
  }, []);

  const handleCreateUnloadingCrew = useCallback(
    (payload: Parameters<typeof CreateUnloadingCrew.mutate>[0]) => {
      CreateUnloadingCrew.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Cuadrilla registrada correctamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al registrar la cuadrilla",
          );
        },
      });
    },
    [
      CreateUnloadingCrew,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleCreateUnloadingMachinery = useCallback(
    (payload: Parameters<typeof CreateUnloadingMachinery.mutate>[0]) => {
      CreateUnloadingMachinery.mutate(payload, {
        onSuccess: () => {
          handleRequestSuccess("Maquinaria registrada correctamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al registrar la maquinaria",
          );
        },
      });
    },
    [
      CreateUnloadingMachinery,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  const handleCompleteAssignment = useCallback(
    (payload: Parameters<typeof CompleteWarehouseAssignment.mutate>[0]) => {
      CompleteWarehouseAssignment.mutate(payload, {
        onSuccess: () => {
          setDetailReceptionId(null);
          handleRequestSuccess("Asignación completada exitosamente");
        },
        onError: (error) => {
          const mappedError = getMappedError(error as ApiErrorResponse);
          handleRequestError(
            mappedError?.description || "Error al completar la asignación",
          );
        },
      });
    },
    [
      CompleteWarehouseAssignment,
      getMappedError,
      handleRequestError,
      handleRequestSuccess,
    ],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      {(GetWarehouseStaffs.isLoading || GetWarehouseMachineries.isLoading) && (
        <Loader title="Cargando cuadrillas..." />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="m-0!">Cuadrillas</h1>
        <small className="text-gray-500 dark:text-gray-300 text-[12px] sm:text-sm leading-snug">
          Catálogo de personal y maquinaria disponible, y descargas activas con
          su cuadrilla asignada.
        </small>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="flex flex-col gap-3 rounded-md! border! border-slate-200! dark:border-slate-700! bg-white! dark:bg-slate-800! p-4">
          <h3 className="p-0! m-0!">Personal disponible</h3>
          {staffs.length === 0 ? (
            <p className="m-0! text-[13px] text-slate-500 dark:text-slate-300">
              No hay personal registrado.
            </p>
          ) : (
            <ul className="flex flex-col gap-1 m-0! p-0! list-none">
              {staffs.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-md! border! border-slate-200! dark:border-slate-700! p-2 text-[13px]"
                >
                  <span className="min-w-0 truncate">{s.full_name}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    {s.role && (
                      <small className="text-slate-500 dark:text-slate-300">
                        {s.role}
                      </small>
                    )}
                    <Badges
                      label={s.is_active ? "Activo" : "Inactivo"}
                      color={s.is_active ? "success" : "danger"}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-md! border! border-slate-200! dark:border-slate-700! bg-white! dark:bg-slate-800! p-4">
          <h3 className="p-0! m-0!">Maquinaria disponible</h3>
          {machineries.length === 0 ? (
            <p className="m-0! text-[13px] text-slate-500 dark:text-slate-300">
              No hay maquinaria registrada.
            </p>
          ) : (
            <ul className="flex flex-col gap-1 m-0! p-0! list-none">
              {machineries.map((mch) => (
                <li
                  key={mch.id}
                  className="flex items-center justify-between gap-2 rounded-md! border! border-slate-200! dark:border-slate-700! p-2 text-[13px]"
                >
                  <span className="min-w-0 truncate">
                    {mch.name} ({mch.code})
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <small className="text-slate-500 dark:text-slate-300">
                      {resolveMachineryTypeLabel(mch.machinery_type)}
                    </small>
                    <Badges
                      label={mch.is_active ? "Activo" : "Inactivo"}
                      color={mch.is_active ? "success" : "danger"}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="p-0! m-0!">Descargas activas</h3>
        <AssignmentsTable
          data={assignmentItems}
          currentPage={GetWarehouseAssignments.data?.page_number ?? assignmentsPage}
          totalRecords={assignmentsTotal}
          pageSize={GetWarehouseAssignments.data?.page_size ?? PAGE_SIZE}
          onPageChange={setAssignmentsPage}
          onDetailClick={handleDetailClick}
          isFetching={GetWarehouseAssignments.isFetching}
        />
      </section>

      <AssignmentDetailModal
        isOpen={Boolean(detailReceptionId)}
        detail={detail}
        companyId={companyId}
        moduleCode={moduleCode}
        machineries={machineries}
        staffs={staffs}
        isDetailLoading={GetWarehouseAssignmentDetail.isLoading}
        isCreating={
          CreateUnloadingCrew.isPending || CreateUnloadingMachinery.isPending
        }
        isCompleting={CompleteWarehouseAssignment.isPending}
        onCreateUnloadingCrew={handleCreateUnloadingCrew}
        onCreateUnloadingMachinery={handleCreateUnloadingMachinery}
        onCompleteAssignment={handleCompleteAssignment}
        onClose={() => setDetailReceptionId(null)}
      />

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </m.div>
  );
}