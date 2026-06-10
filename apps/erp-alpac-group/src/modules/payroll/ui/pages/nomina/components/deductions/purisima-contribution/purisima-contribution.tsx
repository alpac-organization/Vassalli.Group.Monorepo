import { useFormContext } from "react-hook-form";
import { InputText } from "@alpac/design-system";
import { formatAmount } from "@app/shared/utils/number.utils";
import type { AddDeductionFormValues } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const parsePositiveInteger = (value: unknown): number | undefined => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return undefined;
  const parsed = parseInt(trimmed.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const PurisimaContribution = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddDeductionFormValues>();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <InputText
        label="Monto total de la contribución"
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        className={inputClassName}
        labelClassName={labelClassName}
        isRequired
        {...register("purisima_information.purisima_payload.amount", {
          required: "El monto de la contribución es requerido",
          setValueAs: (value: unknown) => {
            const stringValue =
              typeof value === "string" ? value : String(value || "");
            const trimmed = stringValue.trim();
            return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
          },
          validate: (value?: number) =>
            (value !== undefined && value > 0) ||
            "El monto de la contribución debe ser mayor a 0",
          onChange: (evt) => {
            evt.target.value = formatAmount(evt.target.value, 5, 2);
          },
        })}
        error={
          errors.purisima_information?.purisima_payload?.amount?.message
        }
      />

      <InputText
        label="Plazo (quincenas)"
        type="text"
        inputMode="numeric"
        placeholder="0"
        className={inputClassName}
        labelClassName={labelClassName}
        isRequired
        {...register("purisima_information.purisima_payload.number_fortnights", {
          required: "El plazo en quincenas es requerido",
          setValueAs: parsePositiveInteger,
          validate: (value?: number) =>
            (value !== undefined && Number.isInteger(value) && value > 0) ||
            "El plazo debe ser un número entero mayor a 0",
          onChange: (evt) => {
            evt.target.value = evt.target.value.replace(/\D/g, "");
          },
        })}
        error={
          errors.purisima_information?.purisima_payload?.number_fortnights
            ?.message
        }
      />
    </div>
  );
};
