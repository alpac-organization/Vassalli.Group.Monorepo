import { Button, DatePicker, TimePicker, Checkbox } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type {
  GenerateExitFormValues,
  GenerateExitModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/types/generate-exit-modal.types";
import {
  buttonCancelClass,
  buttonActionClass,
  EXIT_DATE_BEFORE_ENTRY_MESSAGE,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";
import { isMobileViewport } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/utils/utils";

dayjs.extend(customParseFormat);

const DATE_FORMATS = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DDTHH:mm:ssZ",
  "YYYY-MM-DDTHH:mm:ss.SSSZ",
] as const;

function parseEntryDate(entryDate?: string | null): Dayjs | null {
  const raw = entryDate?.trim();
  if (!raw) return null;

  const strict = dayjs(raw, DATE_FORMATS as unknown as string[], true);
  if (strict.isValid()) return strict.startOf("day");

  const fallback = dayjs(raw);
  return fallback.isValid() ? fallback.startOf("day") : null;
}

function toDayjsValue(value: unknown): Dayjs | null {
  if (value == null) return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;

  if (value instanceof Date) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  if (typeof value === "object" && "$d" in value) {
    const nativeDate = (value as { $d?: Date }).$d;
    if (!(nativeDate instanceof Date)) return null;
    const parsed = dayjs(nativeDate);
    return parsed.isValid() ? parsed : null;
  }

  return null;
}

export function GenerateExitModal({
  onClose,
  onSubmit,
  isSubmitting = false,
  entryDate,
  entryTime: _entryTime,
}: GenerateExitModalProps) {
  const entryDay = parseEntryDate(entryDate);
  const [isExitDatePickerOpen, setIsExitDatePickerOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<GenerateExitFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      specifyDateTime: false,
      exitDate: null,
      exitTime: null,
    },
  });

  const specifyDateTime = watch("specifyDateTime");
  const hideExitDateErrorOnMobile =
    isMobileViewport() && isExitDatePickerOpen;

  const validateExitDate = (
    value: GenerateExitFormValues["exitDate"],
  ): true | string => {
    if (!value) return true;

    const date = toDayjsValue(value);
    if (!date) return "La fecha no es válida.";

    if (entryDay && date.isBefore(entryDay, "day")) {
      return EXIT_DATE_BEFORE_ENTRY_MESSAGE;
    }

    return true;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 mt-2"
    >
      <div className="flex items-center">
        <Controller
          name="specifyDateTime"
          control={control}
          render={({ field }) => (
            <Checkbox
              label="Especificar fecha y hora de salida"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {specifyDateTime && (
          <m.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 overflow-visible"
          >
            <div className="flex-1 min-w-0">
              <Controller
                name="exitDate"
                control={control}
                rules={{
                  required: "La fecha es requerida",
                  validate: validateExitDate,
                }}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de salida"
                    labelAbove
                    isRequired
                    fieldWidth="large"
                    value={field.value}
                    onOpen={() => {
                      if (!isMobileViewport()) return;
                      setIsExitDatePickerOpen(true);
                      clearErrors("exitDate");
                    }}
                    onClose={() => {
                      if (!isMobileViewport()) return;
                      setIsExitDatePickerOpen(false);
                      void trigger("exitDate");
                      if (getValues("exitTime")) {
                        void trigger("exitTime");
                      } else {
                        clearErrors("exitTime");
                      }
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                      if (isMobileViewport()) {
                        clearErrors("exitDate");
                        return;
                      }
                      void trigger("exitDate");
                      if (getValues("exitTime")) {
                        void trigger("exitTime");
                      } else {
                        clearErrors("exitTime");
                      }
                    }}
                    error={
                      hideExitDateErrorOnMobile
                        ? undefined
                        : typeof errors.exitDate?.message === "string"
                          ? errors.exitDate.message
                          : undefined
                    }
                    errorVariant="tooltip"
                  />
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Controller
                name="exitTime"
                control={control}
                rules={{
                  required: "La hora es requerida",
                }}
                render={({ field }) => (
                  <TimePicker
                    label="Hora de salida"
                    labelAbove
                    isRequired
                    fieldWidth="large"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      void trigger("exitTime");
                      if (getValues("exitDate")) {
                        void trigger("exitDate");
                      }
                    }}
                    error={
                      typeof errors.exitTime?.message === "string"
                        ? errors.exitTime.message
                        : undefined
                    }
                    errorVariant="text"
                    hideErrorOnMobile
                  />
                )}
              />
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center gap-3 mt-4">
        <Button
          type="button"
          label="Cancelar"
          size="giant"
          className={buttonCancelClass}
          onClick={onClose}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          label="Dar salida"
          size="giant"
          className={buttonActionClass}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
