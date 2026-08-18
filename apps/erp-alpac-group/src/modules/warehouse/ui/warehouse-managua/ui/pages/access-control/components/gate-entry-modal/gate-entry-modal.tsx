import { Button, Modal, Stepper } from "@alpac/design-system";
import { AnimatePresence, m } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { Ducat } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/ducat/ducat";
import { VehicleDataStep } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data/vehicle-data";
import {
  GATE_ENTRY_DEFAULT_VALUES,
  type GateEntryFormValues,
  type GateEntryModalProps,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { ConfirmModal } from "@app/shared/components/confirm-modal/confirm-modal";
import {
  footerButtonClass,
  stepVariants,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";
import { CustomsDeclaration } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/customs-declaration/customs-declaration";

const GENERAL_STEP_FIELDS: (keyof GateEntryFormValues)[] = [
  "transportUnitId",
  "countryOfOrigin",
  "customBranchId",
  "plateNumber",
  "trailerChassis",
  "containerNumber",
  "driverName",
  "driverLicense",
  "transportista",
  "sealNumber",
];

export function GateEntryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  vehicleOptions = [],
}: GateEntryModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDirection, setStepDirection] = useState(1);
  const [isDeleteAllDucasConfirmOpen, setIsDeleteAllDucasConfirmOpen] =
    useState(false);
  const [ducasError, setDucasError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(
    DocumentEnum.DUCA,
  );
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    unregister,
    trigger,
    formState: { errors },
  } = useForm<GateEntryFormValues>({
    mode: "onChange",
    defaultValues: GATE_ENTRY_DEFAULT_VALUES,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "ducas",
  });

  const isDucaDocument = documentType.value === DocumentEnum.DUCA.value;
  const isCustomsDocument =
    documentType.value === DocumentEnum.CustomsDeclaration.value;

  const stepperLabels = useMemo(
    () => [
      "Información general",
      isDucaDocument ? "Documentos DUCA" : "Declaración aduanera",
    ],
    [isDucaDocument],
  );

  useEffect(() => {
    if (!isOpen) {
      reset(GATE_ENTRY_DEFAULT_VALUES);
      setCurrentStep(0);
      setStepDirection(1);
      setIsDeleteAllDucasConfirmOpen(false);
      setDucasError(null);
      setDocumentType(DocumentEnum.DUCA);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    if (isSubmitting) return;
    reset(GATE_ENTRY_DEFAULT_VALUES);
    setCurrentStep(0);
    setStepDirection(1);
    setIsDeleteAllDucasConfirmOpen(false);
    setDucasError(null);
    setDocumentType(DocumentEnum.DUCA);
    onClose();
  };

  const handleDocumentTypeChange = (type: DocumentType) => {
    setDocumentType(type);
    setDucasError(null);

    if (type.value === DocumentEnum.DUCA.value) {
      unregister([
        "customsDeclarationNumber",
        "packages",
        "customer",
        "product",
      ]);
      setValue("customsDeclarationNumber", "");
      setValue("packages", "");
      setValue("customer", "");
      setValue("product", "");
      clearErrors([
        "customsDeclarationNumber",
        "packages",
        "customer",
        "product",
      ]);
      if (fields.length === 0) {
        replace([{ value: "" }]);
      }
      return;
    }

    replace([]);
    clearErrors("ducas");
  };

  const handleAddDuca = () => {
    append({ value: "" });
    setDucasError(null);
  };

  const handleConfirmDeleteAllDucas = () => {
    replace([]);
    setDucasError(null);
    setIsDeleteAllDucasConfirmOpen(false);
  };

  const goToStep = (nextStep: number) => {
    setStepDirection(nextStep > currentStep ? 1 : -1);
    setCurrentStep(nextStep);
  };

  const handleContinue = async () => {
    const isValid = await trigger(GENERAL_STEP_FIELDS);
    if (!isValid) return;
    setDucasError(null);
    goToStep(1);
  };

  const handleBack = () => {
    setDucasError(null);
    goToStep(0);
  };

  const handleFormSubmit: SubmitHandler<GateEntryFormValues> = (data) => {
    if (currentStepRef.current !== 1) return;

    if (isDucaDocument) {
      const ducas = Array.isArray(data.ducas) ? data.ducas : [];
      const hasAtLeastOneDuca = ducas.some((duca) => duca.value.trim());
      const seen = new Set<string>();
      const hasDuplicates = ducas.some((duca) => {
        const value = duca.value.trim();
        if (!value) return false;
        if (seen.has(value)) return true;
        seen.add(value);
        return false;
      });

      if (!hasAtLeastOneDuca) {
        setDucasError(
          "Debe agregar al menos una DUCA para guardar el registro.",
        );
        return;
      }

      if (hasDuplicates) {
        setDucasError("Existen documentos DUCA duplicadas");
        return;
      }
    }

    onSubmit(data, documentType);
  };

  const handleFinalSave = () => {
    if (currentStepRef.current !== 1) return;
    void handleSubmit(handleFormSubmit)();
  };

  const modalSize = currentStep === 0 ? "5xl" : isDucaDocument ? "lg" : "3xl";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Registro de Entrada de Vehículo"
        variant="default"
        size={modalSize}
        panelClassName={[
          "flex! flex-col!",
          currentStep === 1 && isDucaDocument
            ? fields.length === 0
              ? "max-xl:min-h-[min(58dvh,30rem)]! max-xl:max-h-[min(85dvh,40rem)]! xl:min-h-[min(58dvh,34rem)]! xl:max-h-[min(80dvh,40rem)]!"
              : "max-xl:max-h-[min(78dvh,36rem)]! xl:min-h-[min(55dvh,32rem)]! xl:max-h-[min(80dvh,40rem)]!"
            : "max-h-[min(92dvh,60rem)]!",
          "overflow-hidden!",
          "p-4! sm:p-6!",
          "w-[calc(100%-1rem)]! sm:w-full!",
          "transition-[max-width,max-height,min-height] duration-300 ease-out!",
          "[&>div:last-of-type]:flex-1!",
          "[&>div:last-of-type]:min-h-0!",
          "[&>div:last-of-type]:flex!",
          "[&>div:last-of-type]:flex-col!",
          "[&>div:last-of-type]:overflow-hidden!",
        ].join(" ")}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (currentStepRef.current !== 1) return;
            void handleSubmit(handleFormSubmit)(event);
          }}
          className="flex flex-col flex-1 min-h-0 h-full overflow-hidden"
        >
          <div
            className={`shrink-0 px-1 ${currentStep === 1 ? "mb-5 sm:mb-6" : "mb-2"}`}
          >
            <Stepper
              steps={stepperLabels}
              currentStep={currentStep}
              className="py-5! sm:py-6!"
            />
          </div>

          {currentStep === 1 && isDucaDocument ? (
            <div className="shrink-0 z-20 grid grid-cols-2 gap-2 py-2 px-1 mb-1 bg-white dark:bg-[#272b34] border-b border-slate-200 dark:border-neutral-700 sm:flex sm:justify-center sm:items-center sm:gap-4 sm:border-b-0 sm:mb-0">
              <Button
                type="button"
                label="Eliminar todas"
                size="medium"
                onClick={() => setIsDeleteAllDucasConfirmOpen(true)}
                disabled={fields.length === 0}
                icon={<Trash2Icon size={18} />}
                className="w-full! sm:w-auto! max-sm:h-8! max-sm:px-2! max-sm:py-1! max-sm:text-[12px]! text-[14px]! rounded-md! text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800! disabled:opacity-40! justify-center!"
              />
              <Button
                type="button"
                label="Agregar Duca"
                size="medium"
                onClick={handleAddDuca}
                icon={<PlusIcon size={18} />}
                className="w-full! sm:w-auto! max-sm:h-8! max-sm:px-2! max-sm:py-1! max-sm:text-[12px]! text-[14px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
              />
            </div>
          ) : null}

          <div
            className={[
              "relative flex-1 min-h-0",
              currentStep === 1 && isDucaDocument && fields.length === 0
                ? "flex flex-col max-xl:[&>div]:flex-1 max-xl:[&>div]:flex max-xl:[&>div]:flex-col max-xl:[&>div]:min-h-0 max-xl:[&>div]:h-full"
                : "",
              "overflow-x-hidden overflow-y-auto",
              "overscroll-contain scrollbar-dashboard",
              "py-2 sm:py-1 px-1",
            ].join(" ")}
          >
            <AnimatePresence mode="wait" custom={stepDirection} initial={false}>
              {currentStep === 0 ? (
                <m.div
                  key="step-general"
                  custom={stepDirection}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col gap-4"
                >
                  <VehicleDataStep
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    errors={errors}
                    documentType={documentType}
                    onChangeDocumentType={handleDocumentTypeChange}
                    vehicleOptions={vehicleOptions}
                  />
                </m.div>
              ) : (
                <m.div
                  key={`step-document-${documentType.value}`}
                  custom={stepDirection}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className={
                    isDucaDocument && fields.length === 0
                      ? "flex flex-1 flex-col h-full min-h-0"
                      : "flex flex-col gap-4"
                  }
                >
                  {isDucaDocument && (
                    <Ducat
                      fields={fields}
                      register={register}
                      onRemove={remove}
                    />
                  )}

                  {isCustomsDocument && (
                    <div>
                      <h5 className="m-0! px-2 mb-1">
                        Documentos de Declaración Aduanera
                      </h5>
                      <CustomsDeclaration register={register} errors={errors} />
                    </div>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <div className="shrink-0 sticky bottom-0 z-10 bg-white dark:bg-[#272b34] grid grid-cols-2 gap-2 sm:flex sm:flex-nowrap sm:justify-center xl:justify-end sm:items-center sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-600 dark:border-neutral-600">
            {currentStep === 0 ? (
              <>
                <Button
                  type="button"
                  label="Cancelar"
                  size="giant"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`${footerButtonClass} col-span-1 text-white! bg-red-600! hover:bg-red-500! dark:bg-red-900! dark:hover:bg-red-800!`}
                  icon={<XIcon size={18} />}
                />
                <Button
                  type="button"
                  label="Continuar"
                  size="giant"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                  className={`${footerButtonClass} col-span-1 order-2 sm:order-0 text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!`}
                  icon={<ChevronRightIcon size={18} />}
                />
              </>
            ) : (
              <>
                <Button
                  type="button"
                  label="Atrás"
                  size="giant"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className={`${footerButtonClass} col-span-1 text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600!`}
                  icon={<ChevronLeftIcon size={18} />}
                />
                <Button
                  type="button"
                  label="Finalizar y Guardar"
                  size="giant"
                  onClick={handleFinalSave}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  className={`${footerButtonClass} col-span-1 order-2 sm:order-0 text-white! bg-emerald-800! hover:bg-emerald-700!`}
                  icon={<SaveIcon size={18} />}
                />
              </>
            )}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteAllDucasConfirmOpen}
        type="APPROVE"
        title="¿Está seguro de eliminar todas las DUCAs? Esta acción es irreversible."
        buttonActionLabel="Eliminar todas"
        buttonActionClass="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300"
        onClose={() => setIsDeleteAllDucasConfirmOpen(false)}
        handleFinalAction={handleConfirmDeleteAllDucas}
      />

      <Modal
        isOpen={Boolean(ducasError)}
        onClose={() => setDucasError(null)}
        variant="info"
        size="sm"
        panelClassName="dark:border dark:border-neutral-700"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {ducasError}
          </p>
          <Button
            type="button"
            label="OK"
            size="giant"
            onClick={() => setDucasError(null)}
            className="rounded-md! px-8! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! justify-center!"
          />
        </div>
      </Modal>
    </>
  );
}
