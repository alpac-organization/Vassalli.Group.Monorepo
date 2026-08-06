import { Button, DatePicker, TimePicker, Checkbox } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import type {
  GenerateExitFormValues,
  GenerateExitModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/types/generate-exit-modal.types";
import {
  buttonCancelClass,
  buttonActionClass,
  EXIT_DATE_BEFORE_ENTRY_MESSAGE,
  EXIT_TIME_BEFORE_ENTRY_MESSAGE,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";

function parseEntryAt(entryAt?: string | null) {
  if (!entryAt?.trim()) return null;
  const parsed = dayjs(entryAt.trim());
  return parsed.isValid() ? parsed : null;
}

function combineExitDateTime(
  exitDate: GenerateExitFormValues["exitDate"],
  exitTime: GenerateExitFormValues["exitTime"],
) {
  if (!exitDate || !exitTime) return null;

  const date = dayjs(exitDate);
  const time = dayjs(exitTime);
  if (!date.isValid() || !time.isValid()) return null;

  return date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
}

export function GenerateExitModal({
  onClose,
  onSubmit,
  isSubmitting = false,
  entryAt,
}: GenerateExitModalProps) {
  const entryMoment = parseEntryAt(entryAt);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<GenerateExitFormValues>({
    defaultValues: {
      specifyDateTime: false,
      exitDate: null,
      exitTime: null,
    },
  });

  const specifyDateTime = watch("specifyDateTime");
  const exitDate = watch("exitDate");

  const validateExitDate = (
    value: GenerateExitFormValues["exitDate"],
  ): true | string => {
    if (!value) return true;
    if (!entryMoment) return true;

    const date = dayjs(value);
    if (!date.isValid()) return "La fecha no es válida.";

    if (date.isBefore(entryMoment, "day")) {
      return EXIT_DATE_BEFORE_ENTRY_MESSAGE;
    }

    return true;
  };

  const validateExitTime = (
    value: GenerateExitFormValues["exitTime"],
  ): true | string => {
    if (!value || !exitDate || !entryMoment) return true;

    const exitMoment = combineExitDateTime(exitDate, value);
    if (!exitMoment) return true;

    if (exitMoment.isBefore(entryMoment)) {
      return EXIT_TIME_BEFORE_ENTRY_MESSAGE;
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
                    minDate={entryMoment ?? undefined}
                    onChange={(value) => {
                      field.onChange(value);
                      void trigger(["exitDate", "exitTime"]);
                    }}
                    error={errors.exitDate?.message as string | undefined}
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
                  validate: validateExitTime,
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
                      void trigger(["exitDate", "exitTime"]);
                    }}
                    error={errors.exitTime?.message as string | undefined}
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
