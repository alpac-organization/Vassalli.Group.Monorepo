import { Controller } from "react-hook-form";
import { Dropdown } from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import { GetBranchesOptions } from "../../../../stock-control.variants";
import { dropdownClassName, labelClassName } from "@app/modules/purchasing/ui/pages/supplier/utils/style";
import type { FilterDropdownProps } from "../../stock-control-section-filters.types";

export const BranchFilter = function({ control }: FilterDropdownProps){
   const { companyId } = useUserStore();

   const { GetBranchesQuery } = useCompanies({
      company_id: companyId
   });

   const branchesOptions = GetBranchesOptions(GetBranchesQuery.data ?? []);

   return (
      <div className="w-full sm:w-64">
         <Controller
            name="branch_id"
            control={control}
            render={({ field }) => (
               <Dropdown
                  isLoading={GetBranchesQuery.isPending || GetBranchesQuery.isFetching}
                  label="Sucursal"
                  value={field.value}
                  options={branchesOptions}
                  onChange={(e) => {
                     field.onChange(e);
                  }}
                  placeholder="Seleccionar Sucursal"
                  appearance="dark"
                  labelClassName={labelClassName}
                  className={dropdownClassName}
               />
            )}
         />
      </div>
   )
}