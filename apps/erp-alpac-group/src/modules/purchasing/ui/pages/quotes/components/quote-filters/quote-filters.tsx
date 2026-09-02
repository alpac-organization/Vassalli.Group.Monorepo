import { Button, DatePicker, InputText } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import { CompanyMatadata, type CompanyType } from "@app/core/enums/company.enum";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type {
   QuoteFilterForm,
   QuoteFiltersProps,
} from "@app/modules/purchasing/ui/pages/quotes/components/quote-filters/quote-filters.types";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const defaultQuoteFilterForm: QuoteFilterForm = {
   code: "",
   date: null
};

export const QuoteFilters = ({
   codeLabel = "N° Solicitud",
   codeExample = "MGA-REQ-01",
   codePlaceholder,
   defaultValues = defaultQuoteFilterForm,
   onApply,
   onClear,
}: QuoteFiltersProps) => {

   const { companyAlias } = useUserStore();

   const companyAcronym =
      CompanyMatadata[companyAlias.toUpperCase() as CompanyType]?.acronym ??
      CompanyMatadata.ALPAC.acronym;

   const { register, control, handleSubmit, reset } = useForm<QuoteFilterForm>({
      defaultValues,
   });

   const handleApplyFilters = (data: QuoteFilterForm) => {
      onApply({
         code: data?.code?.trim() || undefined,
         date: data?.date
      });
   };

   const handleClearFilters = () => {
      reset(defaultValues);
      onClear();
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
               <h3 className="p-0! m-0!">Filtros</h3>
            </div>
         </div>

         <form
            onSubmit={handleSubmit(handleApplyFilters)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end mb-4!"
         >
            <InputText
               label={codeLabel}
               placeholder={codePlaceholder ?? `Ej. ${companyAcronym}-${codeExample}`}
               className={inputClassName}
               labelClassName={labelClassName}
               {...register("code")}
            />

            <Controller
					control={control}
					name="date"
					render={({ field }) => (
						<DatePicker
							label="Mes"
							labelAbove
							views={["year", "month"]}
							openTo="month"
							format="MMMM YYYY"
							disableFuture
							className={inputClassName}
							value={field.value}
							onChange={(value) => field.onChange(value)}
							slotProps={{
								popper: {
									disablePortal: false, sx: { zIndex: 2000 }
								}
							}}
						/>
					)}
				/>

            <Button
               type="submit"
               size="giant"
               label="Aplicar filtros"
               className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />

            <Button
               type="button"
               size="giant"
               label="Limpiar filtros"
               onClick={handleClearFilters}
               className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            />
         </form>
      </div>
   );
};
