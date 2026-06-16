// import { useFormContext, Controller } from "react-hook-form";
// import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
// import { InputText, Dropdown } from "@alpac/design-system";
// import { formatAmount } from "@app/shared/utils/number.utils";
// import { CurrencyOptions } from "@app/core/enums/currency.enum";

// export const SalaryAdvance = () => {
//    const { register, control, formState: { errors } } = useFormContext<AddDeductionFormValues>();

//    return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//          <InputText
//             label="Monto del adelanto"
//             type="text"
//             inputMode="decimal"
//             placeholder="0.00"
//             className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
//             labelClassName="text-black! dark:text-white!"
//             isRequired
//             {...register("salary_advance_payload.amount", {
//                required: "El monto del adelanto es requerido",
//                setValueAs: (value: any) => {
//                   const stringValue = typeof value === "string" ? value : String(value || "");
//                   const trimmed = stringValue.trim();
//                   return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
//                },
//                validate: (value?: number) =>
//                   (value !== undefined && value > 0) ||
//                   "El monto del adelanto debe ser mayor a 0",
//             })}
//             error={
//                errors.salary_advance_payload?.amount &&
//                errors.salary_advance_payload?.amount?.message
//             }
//             onChange={(evt) => {
//                evt.target.value = formatAmount(evt.target.value, 18, 2);
//             }}
//          />

//          <Controller
//             name="salary_advance_payload.currency"
//             control={control}
//             defaultValue="NIO"
//             rules={{ required: "La moneda es requerida" }}
//             render={({ field }) => (
//                <Dropdown
//                   label="Moneda"
//                   placeholder="Seleccione moneda"
//                   appearance="dark"
//                   isRequired
//                   value={field.value}
//                   onChange={(value) => field.onChange(value)}
//                   options={CurrencyOptions ?? []}
//                   labelClassName="text-black! dark:text-white!"
//                   className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
//                />
//             )}
//          />
//       </div>
//    );
// };
