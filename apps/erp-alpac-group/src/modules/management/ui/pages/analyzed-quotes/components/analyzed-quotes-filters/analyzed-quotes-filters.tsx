import { Button, Dropdown, InputText, SectionHeader } from "@alpac/design-system";
import { useMemo, useState } from "react";
import {
  ManagementReviewStatus,
  ManagementReviewStatusOptions,
  type managementReviewStatusType,
} from "@app/modules/management/domain/enum/management-review-status";
import {
  PriorityLevelOptions,
  type PriorityLevelType,
} from "@app/modules/purchasing/domain/enums/purchase-request-priority-level.enum";
import {
  PurchaseRequestTypeOptions,
  type PurchaseRequestType,
} from "@app/modules/purchasing/domain/enums/purchase-request.enum";
import type { AnalyzedQuotesFiltersProps } from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quotes-filters/analyzed-quotes-filters.types";
import {
  dropdownClassName,
  inputClassName,
  labelClassName,
} from "@app/modules/management/ui/pages/analyzed-quotes/components/analyzed-quotes-filters/utils/styles";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { useUserStore } from "@app/shared/stores/useUserStore";

const resolveOptionValue = <T extends string>(
  options: ReadonlyArray<{ value: T }>,
  value: string | number,
  fallback: T,
): T | "" => {
  if (value === "" || value == null) return "";
  return options.find((option) => option.value === value)?.value ?? fallback;
};

export function AnalyzedQuotesFilters({
  onApply,
  onClear,
}: AnalyzedQuotesFiltersProps) {
  const { companyId, moduleCode } = useUserStore();
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriorityLevel, setSelectedPriorityLevel] = useState<string>("");
  const [selectedRequestType, setSelectedRequestType] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const { GetAreasByCompany } = useAreas({
    company_id: companyId ?? "",
    module_code: moduleCode ?? "",
  });
  const { GetBranchesQuery } = useCompanies({ company_id: companyId });

  const areaOptions = useMemo(
    () =>
      (GetAreasByCompany.data ?? []).map((area) => ({
        label: area.work_area_name,
        value: area.work_area_id,
      })),
    [GetAreasByCompany.data],
  );

  const branchOptions = useMemo(
    () =>
      (GetBranchesQuery.data ?? []).map((branch) => ({
        label: branch.branch_name,
        value: branch.branch_id,
      })),
    [GetBranchesQuery.data],
  );

  const priorityLevelOptions = useMemo(
    () =>
      PriorityLevelOptions.map((priority) => ({
        label: priority.label,
        value: priority.textValue,
      })),
    [],
  );

  const requestTypeOptions = useMemo(
    () =>
      PurchaseRequestTypeOptions.map((requestType) => ({
        label: requestType.label,
        value: requestType.textValue,
      })),
    [],
  );

  const handleClear = () => {
    setSelectedCode("");
    setSelectedStatus("");
    setSelectedPriorityLevel("");
    setSelectedRequestType("");
    setSelectedAreaId("");
    setSelectedBranchId("");
    onClear();
  };

  return (
    <div className="flex flex-col gap-4 pt-2 border-t border-slate-200 dark:border-neutral-700">
      <SectionHeader
        title="Filtros"
        subtitle="Filtra las cotizaciones analizadas por código de solicitud, estado de revisión, nivel de prioridad, tipo de solicitud, área y sucursal."
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onApply({
            code: selectedCode.trim(),
            status: (selectedStatus || "") as managementReviewStatusType | "",
            priority_level: (selectedPriorityLevel || "") as PriorityLevelType | "",
            request_type: (selectedRequestType || "") as PurchaseRequestType | "",
            area_id: selectedAreaId,
            branch_id: selectedBranchId,
          });
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end"
      >
        <InputText
          label="Código de solicitud"
          placeholder="Ej. REQ-2026-00142"
          value={selectedCode}
          onChange={(event) => setSelectedCode(event.target.value)}
          labelClassName={labelClassName}
          className={`${inputClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Dropdown
          appearance="dark"
          label="Estado de la revisión"
          placeholder="Seleccione un estado de revisión"
          options={ManagementReviewStatusOptions}
          value={selectedStatus}
          onChange={(value) =>
            setSelectedStatus(
              resolveOptionValue(
                ManagementReviewStatusOptions,
                value,
                ManagementReviewStatus.Pending.textValue,
              ),
            )
          }
          labelClassName={labelClassName}
          valueClassName={labelClassName}
          className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Dropdown
          appearance="dark"
          label="Nivel de prioridad"
          placeholder="Seleccione una prioridad"
          options={priorityLevelOptions}
          value={selectedPriorityLevel}
          onChange={(value) =>
            setSelectedPriorityLevel(
              resolveOptionValue(
                priorityLevelOptions,
                value,
                priorityLevelOptions[0].value,
              ),
            )
          }
          labelClassName={labelClassName}
          valueClassName={labelClassName}
          className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Dropdown
          appearance="dark"
          label="Tipo de solicitud"
          placeholder="Seleccione un tipo"
          options={requestTypeOptions}
          value={selectedRequestType}
          onChange={(value) =>
            setSelectedRequestType(
              resolveOptionValue(
                requestTypeOptions,
                value,
                requestTypeOptions[0].value,
              ),
            )
          }
          labelClassName={labelClassName}
          valueClassName={labelClassName}
          className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Dropdown
          appearance="dark"
          label="Área"
          placeholder="Seleccione un área"
          options={areaOptions}
          value={selectedAreaId}
          onChange={(value) => setSelectedAreaId(String(value ?? ""))}
          labelClassName={labelClassName}
          valueClassName={labelClassName}
          className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Dropdown
          appearance="dark"
          label="Sucursal"
          placeholder="Seleccione una sucursal"
          options={branchOptions}
          value={selectedBranchId}
          onChange={(value) => setSelectedBranchId(String(value ?? ""))}
          labelClassName={labelClassName}
          valueClassName={labelClassName}
          className={`${dropdownClassName} h-[42px]! sm:h-[46px]!`}
        />

        <Button
          type="submit"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          label="Aplicar filtros"
        />

        <Button
          type="button"
          size="giant"
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
          label="Limpiar filtros"
          onClick={handleClear}
        />
      </form>
    </div>
  );
}
