import { Controller } from "react-hook-form";
import { Dropdown } from "@alpac/design-system";
import { GetCostCenterOptions } from "../../../../stock-control.variants";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCostCenters } from "@app/modules/admin/ui/hooks/cost-centers/useCostCenters";
import { dropdownClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";

import type { FilterDropdownProps } from "../../stock-control-section-filters.types";

export const CostCenterFilter = function({ control }: FilterDropdownProps){
   const { companyId, moduleCode } = useUserStore();

   const { GetCostCentersByBranch } = useCostCenters({
      getCostCentersByBranchPayload: {
         company_id:       companyId,
         module_code:      moduleCode,
         only_operational: true
      }
   });

   const costCenterOptions = GetCostCenterOptions(GetCostCentersByBranch.data ?? []);

   return (
      <div className="w-full sm:w-64">
         <Controller
            name="cost_center_id"
            control={control}
            render={({ field }) => (
               <Dropdown
                  isLoading={GetCostCentersByBranch.isPending || GetCostCentersByBranch.isFetching}
                  label="Centro de costo"
                  value={field.value}
                  options={costCenterOptions}
                  onChange={(e) => {
                     field.onChange(e);
                  }}
                  placeholder="Seleccionar centro de costo"
                  appearance="dark"
                  labelClassName={labelClassName}
                  className={dropdownClassName}
               />
            )}
         />
      </div>
   )
}