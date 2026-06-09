import { Dropdown, InputText } from "@alpac/design-system";
import type { CreateIncomeRequest } from "@app/modules/payroll/domain/ApiContract/Requests/incomes-requests/create-income.request";
import { formatAmount } from "@app/shared/utils/number.utils";
import { Controller, useFormContext } from "react-hook-form";
import { CurrencyOptions } from "@app/core/enums/currency.enum";

const inputClassName =
  "w-full! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const Bonus = () => {

    const {
        control,
        register,
        formState: { errors },
      } = useFormContext<CreateIncomeRequest>();
    
      const {
        onChange: onCommissionAmountChange,
        ...bonusAmountField
      } = register("bonus_payload.bonus_amount", {
        required: "El monto del bono es requerido",
        setValueAs: (value: unknown) => {
          const stringValue =
            typeof value === "string" ? value : String(value || "");
          const trimmed = stringValue.trim();
          return trimmed ? parseFloat(trimmed.replace(/,/g, "")) : 0;
        },
        validate: (value?: number) =>
          (value !== undefined && value > 0) || "El monto debe ser mayor a 0",
      });
    
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="bonus_payload.currency"
            control={control}
            rules={{
              required: "Debe seleccionar una moneda",
              validate: (val) => val !== 0 || "Selección inválida",
            }}
            render={({ field }) => (
              <Dropdown
                label="Moneda"
                isRequired
                options={CurrencyOptions ?? []}
                placeholder="Seleccione..."
                onChange={(value) => {
                  field.onChange(value);
                }}
                error={
                  errors.bonus_payload?.currency?.message as string
                }
                value={field.value}
                appearance="dark"
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
              />
            )}
          />
    
          <InputText
            label="Monto del bono"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            className={inputClassName}
            labelClassName={labelClassName}
            isRequired
            {...bonusAmountField}
            error={
              errors.bonus_payload?.bonus_amount
                ?.message as string
            }
            onChange={(evt) => {
              evt.target.value = formatAmount(evt.target.value, 18, 2);
              onCommissionAmountChange(evt);
            }}
          />
        </div>
      );
};