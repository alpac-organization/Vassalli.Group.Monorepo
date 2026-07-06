import { InputText } from "@alpac/design-system";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { isAmountDaysBusinessValid } from "@app/modules/payroll/ui/pages/nomina/components/incomes/utils/parse-holiday-income-excel";
import { formatNumberWithDecimals } from "@app/shared/utils/string.utils";
import { useFormContext } from "react-hook-form";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const Holiday = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateIncomeRequest>();

  const {
    onChange: onAmountDaysChange,
    ...amountDaysField
  } = register("holiday_payload.amount_days", {
    required: "La cantidad de días es requerida",
    setValueAs: (value: unknown) => {
      const trimmed = String(value ?? "").trim();
      return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : undefined;
    },
    validate: (value?: number) =>
      (value !== undefined &&
        isAmountDaysBusinessValid(value) &&
        value > 0) ||
      "La cantidad de días debe ser mayor a 0 y con máximo 2 decimales",
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <InputText
        label="Cantidad de días"
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        className={inputClassName}
        labelClassName={labelClassName}
        isRequired
        {...amountDaysField}
        error={
          errors.holiday_payload?.amount_days?.message as string | undefined
        }
        onChange={(evt) => {
          evt.target.value = String(formatNumberWithDecimals(evt.target.value));
          onAmountDaysChange(evt);
        }}
      />
    </div>
  );
};
