import {
  Breadcrumb,
  Button,
  Dropdown,
  InputText,
  Modal,
  Pagination,
  StatsCard,
  useTheme,
} from "@alpac/design-system";
import { CostCenterTable } from "@app/modules/admin/ui/pages/cost-centers/components/cost-centers-table/cost-center-table";
import { costCenterColumns } from "@app/modules/admin/ui/pages/cost-centers/components/cost-centers-table/cost-centers.columns";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m, LazyMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeftRight,
  Building2,
  PlusCircle,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GetCostCentersResponse } from "@app/modules/admin/domain/ApiContract/responses/cost-centers/get-cost-centers.response";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 10;

export function CostCentersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId } = useUserStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [tempSelectedAreaId, setTempSelectedAreaId] = useState<string | null>(
    null,
  );
  const [isAreaSelectionModalOpen, setIsAreaSelectionModalOpen] =
    useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createCoilCode, setCreateCoilCode] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [isPaging, setIsPaging] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [costCenterToDelete, setCostCenterToDelete] =
    useState<GetCostCentersResponse | null>(null);

  const { GetAreasByCompany } = useAreas({
    company_id: companyId ?? "",
  });

  const areaOptions = useMemo(
    () =>
      (GetAreasByCompany.data ?? []).map((area) => ({
        label: area.work_area_name,
        value: area.work_area_id,
      })),
    [GetAreasByCompany.data],
  );

  const payload = useMemo(() => {
    if (!companyId || !selectedAreaId) {
      return undefined;
    }
    return {
      company_id: companyId,
      area_id: selectedAreaId,
    };
  }, [companyId, selectedAreaId]);

  const { GetCostCenters, createCostCenter, deleteCostCenter } =
    useCostCenters(payload);
  const costCenters = GetCostCenters.data ?? [];

  const paginatedData = useMemo(
    () =>
      costCenters.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE),
    [costCenters, pageNumber],
  );

  const isTableLoading =
    isPaging || (GetCostCenters.isFetching && !GetCostCenters.isPending);

  const handlePageChange = useCallback((page: number) => {
    setIsPaging(true);
    setPageNumber(page);
  }, []);

  useEffect(() => {
    if (!isPaging) {
      return;
    }
    const timer = window.setTimeout(() => setIsPaging(false), 350);
    return () => window.clearTimeout(timer);
  }, [pageNumber, isPaging]);

  const handleConfirmAreaSelection = useCallback(() => {
    if (!tempSelectedAreaId) {
      return;
    }
    setSelectedAreaId(tempSelectedAreaId);
    setSelectedAreaName(
      areaOptions.find((area) => area.value === tempSelectedAreaId)?.label ??
        null,
    );
    setPageNumber(1);
    setIsAreaSelectionModalOpen(false);
  }, [tempSelectedAreaId]);

  const handleAreaModalClose = useCallback(() => {
    if (!selectedAreaId) {
      navigate("/dashboard");
      return;
    }
    setIsAreaSelectionModalOpen(false);
  }, [navigate, selectedAreaId]);

  const handleOpenCreate = useCallback(() => {
    setCreateName("");
    setCreateCoilCode("");
    setCreateDescription("");
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleDeleteClick = useCallback(
    (costCenter: GetCostCentersResponse) => {
      setCostCenterToDelete(costCenter);
      setIsDeleteModalOpen(true);
    },
    [],
  );

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setCostCenterToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!companyId || !selectedAreaId || !costCenterToDelete) {
      return;
    }
    deleteCostCenter.mutate(
      {
        company_id: companyId,
        area_id: selectedAreaId,
        cost_center_id: costCenterToDelete.cost_center_id,
      },
      {
        onSuccess: () => {
          handleCloseDeleteModal();
          setPageNumber(1);
        },
      },
    );
  }, [
    companyId,
    costCenterToDelete,
    deleteCostCenter,
    handleCloseDeleteModal,
    selectedAreaId,
  ]);

  const canSubmitCreate =
    Boolean(
      companyId &&
      selectedAreaId &&
      createName.trim() &&
      createCoilCode.trim() &&
      !Number.isNaN(Number(createCoilCode)),
    ) && !createCostCenter.isPending;

  const handleConfirmCreate = useCallback(() => {
    const coilCode = Number(createCoilCode.trim());
    if (
      !companyId ||
      !selectedAreaId ||
      !createName.trim() ||
      !createCoilCode.trim() ||
      Number.isNaN(coilCode)
    ) {
      return;
    }
    const trimmedDescription = createDescription.trim();
    createCostCenter.mutate(
      {
        company_id: companyId,
        area_id: selectedAreaId,
        cost_center_name: createName.trim(),
        coil_code: coilCode,
        ...(trimmedDescription ? { description: trimmedDescription } : {}),
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setCreateName("");
          setCreateCoilCode("");
          setCreateDescription("");
          setPageNumber(1);
        },
      },
    );
  }, [
    companyId,
    createCoilCode,
    createCostCenter,
    createDescription,
    createName,
    selectedAreaId,
  ]);

  const isAreaModalOpen = isAreaSelectionModalOpen || selectedAreaId === null;

  return (
    <LazyMotion features={loadFeatures} strict>
      <Modal
        isOpen={isAreaModalOpen}
        onClose={handleAreaModalClose}
        variant="default"
        size="sm"
        title="Seleccionar área"
        description="Seleccione el área para consultar sus centros de costo."
      >
        <div className="mt-4 flex flex-col gap-4">
          <Dropdown
            label="Área"
            placeholder="Seleccione un área"
            options={areaOptions}
            value={tempSelectedAreaId ?? undefined}
            appearance={theme === "dark" ? "dark" : "default"}
            labelClassName="text-white!"
            onChange={(value) => setTempSelectedAreaId(String(value))}
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Consultar"
            onClick={handleConfirmAreaSelection}
            disabled={!tempSelectedAreaId}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleAreaModalClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreate}
        variant="default"
        size="sm"
        title="Crear Centro de Costo"
        description={`Complete los datos para registrar un nuevo centro de costo en el área ${selectedAreaName ?? ""}`}
      >
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmitCreate) {
              return;
            }
            handleConfirmCreate();
          }}
        >
          <InputText
            label="Nombre del Centro de Costo"
            placeholder="Ingrese el nombre"
            isRequired
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
          <InputText
            label="Código COIl"
            placeholder="Ingrese el código COIl"
            type="number"
            isRequired
            value={createCoilCode}
            onChange={(e) => setCreateCoilCode(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
          <InputText
            label="Descripción"
            placeholder="Ingrese una descripción (opcional)"
            value={createDescription}
            onChange={(e) => setCreateDescription(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            <Button
              type="submit"
              size="giant"
              label="Crear"
              isLoading={createCostCenter.isPending}
              disabled={!canSubmitCreate}
              className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
            />
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={handleCloseCreate}
              disabled={createCostCenter.isPending}
              className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        variant="default"
        size="sm"
        title="Eliminar centro de costo"
      >
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
          />
          <p className="text-sm text-red-700 dark:text-red-300">
            Esta operación es irreversible. Verifique que no existan recursos
            asignados a este centro de costo antes de eliminarlo.
          </p>
        </div>
        <form
          className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
          onSubmit={(e) => {
            e.preventDefault();
            if (deleteCostCenter.isPending) {
              return;
            }
            handleConfirmDelete();
          }}
        >
          <Button
            type="submit"
            size="giant"
            label="Confirmar"
            isLoading={deleteCostCenter.isPending}
            disabled={deleteCostCenter.isPending}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseDeleteModal}
            disabled={deleteCostCenter.isPending}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </form>
      </Modal>

      {GetCostCenters.isPending && selectedAreaId && (
        <Loader title="Cargando centros de costo..." />
      )}

      {selectedAreaId && !GetCostCenters.isPending && (
        <m.div
          key="cost-centers-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex w-full min-w-0 flex-col gap-4"
        >
          <div className="min-w-0 overflow-x-auto">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  url: "/dashboard",
                  onClick: (url) => navigate(url),
                },
                {
                  label: `${selectedAreaName}`,
                  url: "/administration",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Centros de Costos",
                  url: "/administration/cost-centers",
                  onClick: (url) => navigate(url),
                },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="p-0! m-0! text-xl sm:text-2xl">
                Centros de Costos
              </h3>
              <small className="text-sm text-gray-500 dark:text-gray-300">
                Gestión de centros de costo por área
              </small>
            </div>
            <Button
              size="giant"
              label="Crear Centro de Costo"
              icon={<PlusCircle size={18} />}
              onClick={handleOpenCreate}
              className="w-full! shrink-0 text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:max-w-xs md:max-w-sm lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Centros"
              value={costCenters.length.toString()}
              trend="Centros de costo registrados en el área"
              icon={<Building2 size={30} />}
              borderColor="border-alpac-primary-500! dark:border-alpac-primary-700!"
            />
          </div>

          <div className="flex w-full sm:justify-end">
            <Button
              type="button"
              size="giant"
              label="Cambiar área"
              icon={<ArrowLeftRight size={18} />}
              onClick={() => {
                setTempSelectedAreaId(selectedAreaId);
                setIsAreaSelectionModalOpen(true);
              }}
              className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
            />
          </div>

          <CostCenterTable
            data={paginatedData}
            columns={costCenterColumns}
            deleteIcon={<Trash size={18} />}
            onDeleteClick={handleDeleteClick}
            isLoading={isTableLoading}
            pagination={
              <Pagination
                currentPage={pageNumber}
                pageSize={PAGE_SIZE}
                totalRecords={costCenters.length}
                onPageChange={handlePageChange}
                disabled={isTableLoading}
              />
            }
          />
        </m.div>
      )}
    </LazyMotion>
  );
}
