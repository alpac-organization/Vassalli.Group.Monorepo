import { useFormContext } from "react-hook-form";
import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { InputText } from "@alpac/design-system";
import { formatAmount } from "@app/shared/utils/number.utils";

export const PurisimaContribution = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddDeductionFormValues>();

  return (
    <div className="grid gap-4">
      <InputText
        label="Monto de la contribución"
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
        labelClassName="text-black! dark:text-white!"
        isRequired
        {...register("purisima_data.amount", {
          required: "El monto de la contribución es requerido",
          setValueAs: (value: any) => {
            const stringValue =
              typeof value === "string" ? value : String(value || "");
            const trimmed = stringValue.trim();
            return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
          },
          validate: (value?: number) =>
            (value !== undefined && value > 0) ||
            "El monto de la contribución debe ser mayor a 0",
        })}
        error={
          errors.purisima_payload?.amount &&
          errors.purisima_payload?.amount?.message
        }
        onChange={(evt) => {
          evt.target.value = formatAmount(evt.target.value, 5, 2);
        }}
      />
    </div>
  );
};
