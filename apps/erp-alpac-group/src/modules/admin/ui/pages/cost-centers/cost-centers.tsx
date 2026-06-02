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
import { Building2, PlusCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 10;

export function CostCentersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId } = useUserStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [tempSelectedAreaId, setTempSelectedAreaId] = useState<string | null>(
    null,
  );
  const [isAreaSelectionModalOpen, setIsAreaSelectionModalOpen] =
    useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

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

  const handleConfirmAreaSelection = useCallback(() => {
    if (!tempSelectedAreaId) {
      return;
    }
    setSelectedAreaId(tempSelectedAreaId);
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
    setCreateDescription("");
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleConfirmCreate = useCallback(() => {
    if (!companyId || !selectedAreaId || !createName.trim()) {
      return;
    }
    createCostCenter.mutate(
      {
        company_id: companyId,
        area_id: selectedAreaId,
        cost_center_name: createName.trim(),
        description: createDescription.trim(),
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setCreateName("");
          setCreateDescription("");
          setPageNumber(1);
        },
      },
    );
  }, [
    companyId,
    createCostCenter,
    createDescription,
    createName,
    selectedAreaId,
  ]);

  const handleDelete = useCallback(
    (costCenterId: string) => {
      if (!companyId || !selectedAreaId) {
        return;
      }
      deleteCostCenter.mutate(
        {
          company_id: companyId,
          area_id: selectedAreaId,
          cost_center_id: costCenterId,
        },
        {
          onSuccess: () => setPageNumber(1),
        },
      );
    },
    [companyId, deleteCostCenter, selectedAreaId],
  );

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
        description="Complete los datos para registrar un nuevo centro de costo."
      >
        <div className="mt-4 flex flex-col gap-4">
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
            label="Descripción"
            placeholder="Ingrese una descripción"
            isRequired
            value={createDescription}
            onChange={(e) => setCreateDescription(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Guardar"
            onClick={handleConfirmCreate}
            disabled={
              !createName.trim() ||
              !createDescription.trim() ||
              createCostCenter.isPending
            }
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseCreate}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
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
          className="flex flex-col gap-4"
        >
          <div className="flex justify-start">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  url: "/dashboard",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Finanzas",
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

          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <h3 className="p-0! m-0!">Centros de Costos</h3>
              <small className="text-gray-500 dark:text-gray-300">
                Gestión de centros de costo por área
              </small>
            </div>
            <Button
              size="giant"
              label="+ Crear Centro de Costo"
              //   icon={<PlusCircle size={18} />}
              onClick={handleOpenCreate}
              className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Centros"
              value={costCenters.length.toString()}
              trend="Centros de costo registrados en el área"
              icon={<Building2 size={30} />}
              borderColor="border-alpac-primary-500! dark:border-alpac-primary-700!"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setTempSelectedAreaId(selectedAreaId);
                setIsAreaSelectionModalOpen(true);
              }}
              className="text-sm text-alpac-primary-500 dark:text-alpac-primary-400 underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Cambiar área
            </button>
          </div>

          <CostCenterTable
            data={paginatedData}
            columns={costCenterColumns}
            onDelete={handleDelete}
            pagination={
              <Pagination
                currentPage={pageNumber}
                pageSize={PAGE_SIZE}
                totalRecords={costCenters.length}
                onPageChange={setPageNumber}
                disabled={GetCostCenters.isFetching}
              />
            }
          />
        </m.div>
      )}
    </LazyMotion>
  );
}
