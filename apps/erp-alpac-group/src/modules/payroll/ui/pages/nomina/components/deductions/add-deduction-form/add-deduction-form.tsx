import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { X } from "lucide-react";
import { Button, Dropdown, RadioButton } from "@alpac/design-system";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ChildSupportGarnishment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/child-support-garnishment/child-support-garnishment";
import { Sanctions } from "@app/modules/payroll/ui/pages/nomina/components/deductions/sanction/sanction";
import { JudicialGarnishment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/judicial-garnishment/judicial-garnishment";
import { LoanRepayment } from "@app/modules/payroll/ui/pages/nomina/components/deductions/loan-repayment/loan-repayment";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { FileUploader } from "@app/shared/components/file-uploader/file-uploader";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { LateArrival } from "../late-arrival/late-arrival";
import { PurisimaContribution } from "../purisima-contribution/purisima-contribution";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";

import {
   mapLateArrivalsDeductionError,
   parseLateArrivalsExcel,
   validateLateArrivalsPayload,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/parse-late-arrivals-excel";

import {
   mapPurisimaDeductionError,
   parsePurisimaExcel,
   validatePurisimaPayload,
} from "@app/modules/payroll/ui/pages/nomina/components/deductions/utils/parse-purisima-excel";

import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";
import type { AddDeductionFormProps } from "./add-deduction-form.types";

import type {
   AddDeductionFormValues,
   CreateLateArrivalsDeductionRequest,
   CreateLoanDeductionRequest,
   CreatePurisimaDeductionRequest,
   LateArrivalsInformation,
   LoansPayload,
   PurisimaInformation,
} from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/create-deduction.request";
import { DeductionTypeEnum, DeductionTypeOptions } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";

const inputClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const deductionFormTransition = {
   height: { duration: 0.28, ease: "easeInOut" as const },
   opacity: { duration: 0.35, ease: "easeOut" as const, delay: 0.08 },
   y: { duration: 0.28, ease: "easeOut" as const, delay: 0.08 },
};

const loadMotionFeatures = () =>
   import("framer-motion").then((res) => res.domAnimation);

const isLateArrivalType = (type: AddDeductionFormValues["deduction_type"]) => type === DeductionTypeEnum.LateArrivals.value;
const isPurisimaType = (type: AddDeductionFormValues["deduction_type"]) => type === DeductionTypeEnum.Purisima.value;
const isLoanRepayment = (type: AddDeductionFormValues["deduction_type"]) => type === DeductionTypeEnum.Loans.value;
const isJudicialGarnishment = (type: AddDeductionFormValues["deduction_type"]) => type === DeductionTypeEnum.JudicialGarnishment.value;

export const AddDeductionForm = ({
   branchId,
   payrollId,
   onSubmit,
   onCancel,
   onRequestError,
   onRequestSuccess,
}: AddDeductionFormProps): React.ReactNode => {

   const MANUAL_ENTRY_METHOD = 1;
   const EXCEL_IMPORT_METHOD = 2;

   const { moduleCode, companyId, identificationNumber } = useUserStore();
   const { CreateDeduction } = useDeduction();
   const { getMappedError } = useMappedError();
   const [lateArrivalsFileKey, setLateArrivalsFileKey] = useState(0);
   const [purisimaFileKey, setPurisimaFileKey] = useState(0);
   const [selectedInputMethod, setSelectedInputMethod] = useState<"manualEntry" | "excelImport">("manualEntry");
   const [foundCollaborator, setFoundCollaborator] = useState<GetCollaboratorProfileDetailsResponse | null>(null);
   const [isSearching, setIsSearching] = useState(false);

   const methods = useForm<AddDeductionFormValues>({
      mode: "onChange",
      defaultValues: {
         deduction_type: "",
         company_id: companyId,
         module_code: moduleCode,
         payroll_id: payrollId,
         branch_id: branchId,
         collaborator_id: "",
         description: "",
         late_arrivals_information: undefined,
         purisima_information: undefined,
      },
   });

   useEffect(() => {
      methods.setValue("payroll_id", payrollId);
   }, [payrollId, methods]);

   useEffect(() => {
      methods.setValue("branch_id", branchId);
   }, [branchId, methods]);

   const deductionType = methods.watch("deduction_type");

   const purisimaData = methods.watch("purisima_information.purisima_data");
   const purisimaManualAmount = methods.watch("purisima_information.purisima_payload.amount");
   const purisimaManualFortnights = methods.watch("purisima_information.purisima_payload.number_fortnights");

   const lateArrivalsData = methods.watch("late_arrivals_information.late_arrivals_data");
   const lateLateArrivalManualMinutes = methods.watch("late_arrivals_information.late_arrivals_payload.total_minutes");

   const loanManualAmount = methods.watch("loans_payload.amount");
   const loanManualFortnights = methods.watch("loans_payload.number_fortnights");
   const loanManualCurrency = methods.watch("loans_payload.currency");
   const loanManualDescription = methods.watch("loans_payload.description");

   const judicialCurrency = methods.watch("judicial_seizure_payload.currency");
   const judicialTotalAmountToPay = methods.watch("judicial_seizure_payload.total_amount_to_pay");
   const judicialDeductionPercentage = methods.watch("judicial_seizure_payload.deduction_percentage");

   useEffect(() => {

      if (!isLateArrivalType(deductionType)) methods.setValue("late_arrivals_information", undefined);

      if (!isPurisimaType(deductionType)) methods.setValue("purisima_information", undefined);

      if (!isLoanRepayment(deductionType)) methods.setValue("loans_payload", undefined);

   }, [deductionType, methods]);

   const handleLateArrivalsFileRemove = useCallback(() => {
      methods.setValue("late_arrivals_information", undefined);
   }, [methods]);

   const handleLateArrivalsFileSelect = useCallback(async (file: File) => {

      try {
         const buffer = await file.arrayBuffer();
         const result = parseLateArrivalsExcel(buffer);

         if (!result.ok) {
            onRequestError?.(result.error);
            methods.setValue("late_arrivals_information.late_arrivals_data", undefined);
            setLateArrivalsFileKey((k) => k + 1);
            return;
         }

         methods.setValue("late_arrivals_information.late_arrivals_data", result.rows, {
            shouldValidate: true,
            shouldDirty: true,
         });

      } catch {

         onRequestError?.(
            "No se pudo leer el archivo. Intente de nuevo con un formato .xls o .xlsx v?lido.",
         );
         methods.setValue("late_arrivals_information.late_arrivals_data", undefined);
         setLateArrivalsFileKey((k) => k + 1);
      }

   },
      [methods, onRequestError],
   );

   const handlePurisimaFileRemove = useCallback(() => {
      methods.setValue("purisima_information.purisima_data", undefined);
   }, [methods]);

   const handlePurisimaFileSelect = useCallback(async (file: File) => {
      try {

         const buffer = await file.arrayBuffer();
         const result = parsePurisimaExcel(buffer);

         if (!result.ok) {
            onRequestError?.(result.error);
            methods.setValue("purisima_information.purisima_data", undefined);
            setPurisimaFileKey((k) => k + 1);
            return;
         }

         methods.setValue("purisima_information.purisima_data", result.rows, {
            shouldValidate: true,
            shouldDirty: true,
         });

      } catch {
         onRequestError?.(
            "No se pudo leer el archivo. Intente de nuevo con un .xls o .xlsx v?lido.",
         );
         methods.setValue("purisima_information.purisima_data", undefined);
         setPurisimaFileKey((k) => k + 1);
      }
   },
      [methods, onRequestError],
   );

   const handleSubmitDeduction = useCallback((data: AddDeductionFormValues) => {

      const isManualEntry = selectedInputMethod === "manualEntry";

      if (isLateArrivalType(data.deduction_type)) {

         const { late_arrivals_information, ...lateArrivalsBase } = data;

         let lateArrivalsInformationPayload: LateArrivalsInformation;

         if (isManualEntry) {

            if (!foundCollaborator) {
               onRequestError?.("Debe buscar un colaborador para agregar una Deducción");
               return;
            }

            const totalMinutes = late_arrivals_information?.late_arrivals_payload?.total_minutes;

            if (!totalMinutes || totalMinutes <= 0) {
               onRequestError?.("La cantidad de minutos deben ser mayor a 0");
               return;
            }

            lateArrivalsInformationPayload = {
               procedure_method: MANUAL_ENTRY_METHOD,
               late_arrivals_payload: {
                  identification_number: foundCollaborator!.personal_information.identification_number!,
                  total_minutes: Number(totalMinutes),
               },
            };

         } else {

            const validated = validateLateArrivalsPayload(late_arrivals_information?.late_arrivals_data);

            if (!validated.ok) {
               onRequestError?.(validated.error);
               return;
            }

            lateArrivalsInformationPayload = {
               procedure_method: EXCEL_IMPORT_METHOD,
               late_arrivals_data: validated.rows,
            };
         }

         const lateArrivalsPayload: CreateLateArrivalsDeductionRequest = {
            company_id: lateArrivalsBase.company_id,
            module_code: lateArrivalsBase.module_code,
            branch_id: lateArrivalsBase.branch_id,
            payroll_id: lateArrivalsBase.payroll_id,
            deduction_type: Number(DeductionTypeEnum.LateArrivals.value),
            late_arrivals_information: lateArrivalsInformationPayload,
         };

         CreateDeduction.mutate(lateArrivalsPayload, {
            onSuccess: () => {
               methods.reset();
               onSubmit?.(lateArrivalsPayload);
               onRequestSuccess?.("Deducción agregada correctamente");
               onCancel?.();
            },
            onError: (error: ApiErrorResponse) => {
               const mappedError = getMappedError(error);
               onRequestError?.(
                  mapLateArrivalsDeductionError(mappedError?.description, !isManualEntry),
               );
            },
         });

         return;
      }

      if (isPurisimaType(data.deduction_type)) {

         const { purisima_information, ...purisimaBase } = data;

         let purisimaInformationPayload: PurisimaInformation;

         if (isManualEntry) {

            if (!foundCollaborator) {
               onRequestError?.("Debe buscar un colaborador para agregar una Deducción");
               return;
            }

            const amount = purisima_information?.purisima_payload?.amount;
            const numberFortnights = purisima_information?.purisima_payload?.number_fortnights;

            if (!amount || amount <= 0) {
               onRequestError?.("El monto de la contribución debe ser mayor a 0");
               return;
            }

            if (!numberFortnights || numberFortnights <= 0) {
               onRequestError?.("El plazo debe ser un número entero mayor a 0");
               return;
            }

            purisimaInformationPayload = {
               procedure_method: MANUAL_ENTRY_METHOD,
               purisima_payload: {
                  identification_number: foundCollaborator!.personal_information.identification_number!,
                  amount: Number(amount),
                  number_fortnights: Number(numberFortnights),
               },
            };


         } else {

            const validated = validatePurisimaPayload(purisima_information?.purisima_data);

            if (!validated.ok) {
               onRequestError?.(validated.error);
               return;
            }

            purisimaInformationPayload = {
               procedure_method: EXCEL_IMPORT_METHOD,
               purisima_data: validated.rows
            };
         }

         const purisimaPayload: CreatePurisimaDeductionRequest = {
            company_id: purisimaBase.company_id,
            module_code: purisimaBase.module_code,
            branch_id: purisimaBase.branch_id,
            payroll_id: purisimaBase.payroll_id,
            deduction_type: Number(DeductionTypeEnum.Purisima.value),
            purisima_information: purisimaInformationPayload,
         };

         CreateDeduction.mutate(purisimaPayload, {
            onSuccess: () => {
               methods.reset();
               onSubmit?.(purisimaPayload);
               onRequestSuccess?.("Deducción agregada correctamente");
               onCancel?.();
            },
            onError: (error: ApiErrorResponse) => {
               const mappedError = getMappedError(error);
               onRequestError?.(
                  mapPurisimaDeductionError(mappedError?.description, !isManualEntry),
               );
            },
         });

         return;
      }

      if (isLoanRepayment(data.deduction_type)) {

         if (!foundCollaborator) {
            onRequestError?.("Debe buscar un colaborador para agregar una Deducción");
            return;
         }

         const { loans_payload, ...loansBase } = data;

         const amount = loans_payload?.amount;
         const numberFortnights = loans_payload?.number_fortnights;
         const currency = loans_payload?.currency;
         const description = loans_payload?.description?.trim();

         if (!amount || amount <= 0) {
            onRequestError?.("El monto del pr?stamo debe ser mayor a 0");
            return;
         }

         if (!numberFortnights || numberFortnights <= 0) {
            onRequestError?.("El plazo debe ser un número entero mayor a 0");
            return;
         }

         if (!currency || currency <= 0) {
            onRequestError?.("Debe seleccionar una moneda");
            return;
         }

         if (!description) {
            onRequestError?.("La descripción es requerida");
            return;
         }

         const loansPayload: LoansPayload = {
            amount: Number(amount),
            number_fortnights: Number(numberFortnights),
            currency: Number(currency),
            identification_number: foundCollaborator.personal_information.identification_number!,
            description,
         }

         const loanPayload: CreateLoanDeductionRequest = {
            company_id: loansBase.company_id,
            module_code: loansBase.module_code,
            branch_id: loansBase.branch_id,
            payroll_id: loansBase.payroll_id,
            deduction_type: Number(DeductionTypeEnum.Loans.value),
            loans_payload: loansPayload
         }

         CreateDeduction.mutate(loanPayload, {
            onSuccess: () => {
               methods.reset();
               onSubmit?.(loanPayload);
               onRequestSuccess?.("Deducción agregada correctamente");
               onCancel?.();
            },
            onError: (error: ApiErrorResponse) => {
               const mappedError = getMappedError(error);
               onRequestError?.(mappedError?.description);
            },
         });

         return;
      }
   },
      [
         CreateDeduction,
         foundCollaborator,
         getMappedError,
         methods,
         onCancel,
         onSubmit,
         onRequestError,
         onRequestSuccess,
         selectedInputMethod,
      ],
   );

   const isLateArrivalManualReady = !!foundCollaborator &&
      Number(lateLateArrivalManualMinutes) > 0;

   const isLateArrivalExcelReady = (lateArrivalsData?.length ?? 0) > 0;

   const isLateArrivalReady = isLateArrivalType(deductionType) && (
      selectedInputMethod === "excelImport"
         ? isLateArrivalExcelReady
         : isLateArrivalManualReady
   );

   const isPurisimaManualReady = !!foundCollaborator &&
      Number(purisimaManualAmount) > 0 &&
      Number(purisimaManualFortnights) > 0;

   const isPurisimaExcelReady = (purisimaData?.length ?? 0) > 0;

   const isPurisimaReady = isPurisimaType(deductionType) && (
      selectedInputMethod === "excelImport"
         ? isPurisimaExcelReady
         : isPurisimaManualReady
   );

   const isLoanReady = !!foundCollaborator &&
      Number(loanManualAmount) > 0 &&
      Number(loanManualFortnights) > 0 &&
      Number(loanManualCurrency) > 0 &&
      !!loanManualDescription?.trim();

   const isJudicialGarnishmentReady = !!foundCollaborator &&
      Number(judicialCurrency) &&
      Number(judicialTotalAmountToPay) &&
      Number(judicialDeductionPercentage);

   const isSubmitDisabled =
      CreateDeduction.isPending ||
      !methods.formState.isDirty ||
      !methods.formState.isValid ||
      (isLateArrivalType(deductionType) && !isLateArrivalReady) ||
      (isPurisimaType(deductionType) && !isPurisimaReady) ||
      (isLoanRepayment(deductionType) && !isLoanReady) ||
      (isJudicialGarnishment(deductionType) && !isJudicialGarnishmentReady);

   return (
      <FormProvider {...methods}>
         <form
            className="flex flex-col gap-4"
            onSubmit={methods.handleSubmit(handleSubmitDeduction)}>

            <div>
               <Controller
                  name="deduction_type"
                  control={methods.control}
                  rules={{
                     required: false,
                  }}
                  render={({ field }) => (
                     <Dropdown
                        label="Tipo de Deducción"
                        placeholder="Seleccione el tipo de Deducción"
                        appearance="dark"
                        isRequired
                        value={field?.value}
                        onChange={(value) => {
                           field.onChange(value);
                           setFoundCollaborator(null);
                        }}
                        labelClassName={labelClassName}
                        valueClassName={labelClassName}
                        className={inputClassName}
                        options={DeductionTypeOptions}
                     />
                  )}
               />
            </div>

            <LazyMotion features={loadMotionFeatures} strict>
               <AnimatePresence initial={false}>
                  {(deductionType === DeductionTypeEnum.LateArrivals.value ||
                     deductionType === DeductionTypeEnum.Purisima.value) && (
                        <m.div
                           key="selected-input-method"
                           initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                           animate={{
                              opacity: 1,
                              y: 0,
                              height: "auto",
                              overflow: "visible",
                           }}
                           exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                           transition={deductionFormTransition}
                           className="flex flex-row gap-4"
                        >
                           <RadioButton
                              id="full-day"
                              value="manualEntry"
                              label="Introducir Manualmente"
                              labelPosition="right"
                              labelClassName={labelClassName}
                              checked={selectedInputMethod === "manualEntry"}
                              onChange={() => setSelectedInputMethod("manualEntry")}
                           />

                           <RadioButton
                              id="half-day"
                              value="excelImport"
                              label="Importar desde Excel"
                              labelPosition="right"
                              labelClassName={labelClassName}
                              checked={selectedInputMethod === "excelImport"}
                              onChange={() => {
                                 setSelectedInputMethod("excelImport");
                                 setFoundCollaborator(null);
                              }}
                           />
                        </m.div>
                     )}
               </AnimatePresence>
            </LazyMotion>

            {
               (
                  isLoanRepayment(deductionType) ||
                  isJudicialGarnishment(deductionType) ||
                  (
                     (isPurisimaType(deductionType) || isLateArrivalType(deductionType)) &&
                     selectedInputMethod === "manualEntry"
                  )
               ) &&
               !foundCollaborator &&
               (
                  <CollaboratorSearchForm
                     onSuccess={(collaborator) => {
                        setFoundCollaborator(collaborator);
                        setIsSearching(false);
                     }}
                     onError={() => {
                        setFoundCollaborator(null);
                        setIsSearching(false);
                     }}
                     onSearchStart={() => {
                        setFoundCollaborator(null);
                        setIsSearching(true);
                     }}
                     excludeIdentifications={[identificationNumber]}
                  />
               )
            }

            {
               !!foundCollaborator &&
               (
                  <div className="relative flex w-full min-w-0 flex-row items-center gap-4">
                     <div className="min-w-0 flex-1">
                        <CollaboratorSummary
                           fullName={foundCollaborator?.full_name ?? ""}
                           workPosition={foundCollaborator?.work_position ?? ""}
                           isFullNameLoading={isSearching}
                           isWorkPositionLoading={isSearching}
                        />
                     </div>

                     <div className="group absolute top-0 right-0 flex items-center sm:top-auto">
                        <button
                           type="button"
                           className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                           onClick={() => {
                              setFoundCollaborator(null);
                           }}
                           aria-label="Quitar Colaborador"
                        >
                           <X size={20} />
                        </button>

                        <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                           Quitar Colaborador
                        </div>
                     </div>
                  </div>
               )
            }

            <LazyMotion features={loadMotionFeatures} strict>
               <AnimatePresence initial={false}>
                  {isLoanRepayment(deductionType) && !!foundCollaborator && (
                     <m.div
                        key="loan-repayment"
                        initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                        animate={{
                           opacity: 1,
                           y: 0,
                           height: "auto",
                           overflow: "visible",
                        }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                        transition={deductionFormTransition}
                     >
                        <LoanRepayment />
                     </m.div>
                  )}

                  {isLateArrivalType(deductionType) &&
                     !!foundCollaborator &&
                     selectedInputMethod === "manualEntry" && (
                        <m.div
                           key="late-arrival"
                           initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                           animate={{
                              opacity: 1,
                              y: 0,
                              height: "auto",
                              overflow: "visible",
                           }}
                           exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                           transition={deductionFormTransition}
                        >
                           <LateArrival />
                        </m.div>
                     )}

                  {isLateArrivalType(deductionType) &&
                     selectedInputMethod === "excelImport" && (
                        <m.div
                           key="late-arrival-excel"
                           initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                           animate={{
                              opacity: 1,
                              y: 0,
                              height: "auto",
                              overflow: "visible",
                           }}
                           exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                           transition={deductionFormTransition}
                        >
                           <FileUploader
                              key={lateArrivalsFileKey}
                              title="Cargar archivo de llegadas tardes"
                              description="Formato .xls o .xlsx (columna A: ID empleado, columna C: minutos)"
                              extensions={["xls", "xlsx"]}
                              readySubmitLabel="Agregar Deducción"
                              onFileSelect={handleLateArrivalsFileSelect}
                              onFileRemove={handleLateArrivalsFileRemove}
                           />
                        </m.div>
                     )}

                  {isPurisimaType(deductionType) &&
                     !!foundCollaborator &&
                     selectedInputMethod === "manualEntry" && (
                        <m.div
                           key="purisima-contribution"
                           initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                           animate={{
                              opacity: 1,
                              y: 0,
                              height: "auto",
                              overflow: "visible",
                           }}
                           exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                           transition={deductionFormTransition}
                        >
                           <PurisimaContribution />
                        </m.div>
                     )}

                  {isPurisimaType(deductionType) &&
                     selectedInputMethod === "excelImport" && (
                        <m.div
                           key="purisima-excel"
                           initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                           animate={{
                              opacity: 1,
                              y: 0,
                              height: "auto",
                              overflow: "visible",
                           }}
                           exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                           transition={deductionFormTransition}
                        >
                           <FileUploader
                              key={purisimaFileKey}
                              title="Cargar archivo de pur?sima"
                              description="Formato .xls o .xlsx (columna A: ID empleado, columna C: monto)"
                              extensions={["xls", "xlsx"]}
                              readySubmitLabel="Agregar Deducción"
                              onFileSelect={handlePurisimaFileSelect}
                              onFileRemove={handlePurisimaFileRemove}
                           />
                        </m.div>
                     )}

                  {deductionType === DeductionTypeEnum.Sanction.value && (
                     <m.div
                        key="sanctions"
                        initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                        animate={{
                           opacity: 1,
                           y: 0,
                           height: "auto",
                           overflow: "visible",
                        }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                        transition={deductionFormTransition}
                     >
                        <Sanctions />
                     </m.div>
                  )}

                  {deductionType === DeductionTypeEnum.ChildSupportGarnishment.value && (
                     <m.div
                        key="child-support-garnishment"
                        initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                        animate={{
                           opacity: 1,
                           y: 0,
                           height: "auto",
                           overflow: "visible",
                        }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                        transition={deductionFormTransition}
                     >
                        <ChildSupportGarnishment />
                     </m.div>
                  )}

                  {isJudicialGarnishment(deductionType) &&  !!foundCollaborator && (
                     <m.div
                        key="judicial-garnishment"
                        initial={{ opacity: 0, y: 12, height: 0, overflow: "hidden" }}
                        animate={{
                           opacity: 1,
                           y: 0,
                           height: "auto",
                           overflow: "visible",
                        }}
                        exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
                        transition={deductionFormTransition}
                     >
                        <JudicialGarnishment />
                     </m.div>
                  )}

               </AnimatePresence>
            </LazyMotion>

            <div className="-mx-6 border-t border-t-slate-300 dark:border-t-neutral-600" />

            <div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
               <Button
                  type="button"
                  size="giant"
                  label="Cancelar"
                  onClick={onCancel}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
               />
               <Button
                  type="submit"
                  size="giant"
                  label="Agregar Deducción"
                  disabled={isSubmitDisabled}
                  isLoading={CreateDeduction.isPending}
                  className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! disabled:opacity-60! disabled:cursor-not-allowed! sm:w-auto!"
               />
            </div>
         </form>
      </FormProvider>
   );
};
