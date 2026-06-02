import { Button, Dropdown, Modal, useTheme } from "@alpac/design-system";
import { CostCenterTable } from "@app/modules/admin/ui/pages/cost-centers/components/cost-centers-table/cost-center-table";
import { costCenterColumns } from "@app/modules/admin/ui/pages/cost-centers/components/cost-centers-table/cost-centers.columns";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const { GetCostCenters, deleteCostCenter } = useCostCenters(payload);
  const costCenters = GetCostCenters.data ?? [];

  const handleConfirmAreaSelection = useCallback(() => {
    if (!tempSelectedAreaId) {
      return;
    }
    setSelectedAreaId(tempSelectedAreaId);
    setIsAreaSelectionModalOpen(false);
  }, [tempSelectedAreaId]);

  const handleModalClose = useCallback(() => {
    if (!selectedAreaId) {
      navigate("/dashboard");
      return;
    }
    setIsAreaSelectionModalOpen(false);
  }, [navigate, selectedAreaId]);

  const handleDelete = useCallback(
    (costCenterId: string) => {
      if (!companyId || !selectedAreaId) {
        return;
      }
      deleteCostCenter.mutate({
        company_id: companyId,
        area_id: selectedAreaId,
        cost_center_id: costCenterId,
      });
    },
    [companyId, deleteCostCenter, selectedAreaId],
  );

  const isModalOpen =
    isAreaSelectionModalOpen || selectedAreaId === null;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
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
            onClick={handleModalClose}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      {selectedAreaId && GetCostCenters.isPending && <Loader />}

      {selectedAreaId && !GetCostCenters.isPending && (
        <CostCenterTable
          data={costCenters}
          columns={costCenterColumns}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
