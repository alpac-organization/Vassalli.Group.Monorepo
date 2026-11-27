import { Alert, Button, DatePicker, InputText } from "@alpac/design-system";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { useDeduction } from "@app/modules/payroll/ui/hooks/deduction/useDeduction";
import { DATE_PICKER_MODAL_SLOT_PROPS } from "@app/modules/payroll/ui/pages/nomina/components/deductions/child-support-garnishment/child-support-form.utils";
import { PdfUploader } from "@app/shared/components/pdf-uploader/pdf-uploader";
import type { PdfUploaderValue } from "@app/shared/components/pdf-uploader/pdf-uploader.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { toDateOnly, toDayjsValue } from "@app/shared/utils/date.utils";
import { BanIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  deductionApproveButtonClassName,
  deductionCancelOutlineClassName,
  deductionInputClassName,
  deductionLabelClassName,
  deductionModalFooterClassName,
  sectionTitleClassName,
} from "../../utils/active-deduction.constants";

type OfficialLetterFormValues = {
  official_letter_number: string;
  official_letter_date: string;
  beneficiary_name: string;
};

type RegisterOfficialLetterFormProps = {
  deductionId: string;
  heldPaymentsCount: number;
  initialBeneficiaryName?: string | null;
  onBack: () => void;
  onSuccess: (message: string) => void;
  onError: (message?: string) => void;
};

export function RegisterOfficialLetterForm({
  deductionId,
  heldPaymentsCount,
  initialBeneficiaryName,
  onBack,
  onSuccess,
  onError,
}: RegisterOfficialLetterFormProps) {
  const { companyId, moduleCode } = useUserStore();
  const { RegisterChildSupportOfficialLetter } = useDeduction();
  const { getMappedError } = useMappedError();

  const [attachment, setAttachment] = useState<PdfUploaderValue>({
    fileName: null,
    base64: null,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<OfficialLetterFormValues>({
    mode: "onChange",
    defaultValues: {
      official_letter_number: "",
      official_letter_date: "",
      beneficiary_name: initialBeneficiaryName ?? "",
    },
  });

  const handleFormSubmit = (data: OfficialLetterFormValues) => {
    RegisterChildSupportOfficialLetter.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        deduction_id: deductionId,
        official_letter_number: data.official_letter_number.trim(),
        official_letter_date: data.official_letter_date,
        official_letter_file_base64: attachment.base64 ?? null,
        official_letter_file_name: attachment.fileName ?? null,
        beneficiary_name: data.beneficiary_name.trim() || null,
      },
      {
        onSuccess: () => {
          onSuccess(
            "Oficio judicial registrado y cheques liberados correctamente",
          );
        },
        onError: (err: ApiErrorResponse) => {
          const mapped = getMappedError(err);
          onError(
            mapped.description || "No se pudo registrar el oficio judicial",
          );
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
        <div className="flex flex-col gap-4 pb-4">
          <h4 className={sectionTitleClassName}>Registrar Oficio Judicial</h4>

          {heldPaymentsCount > 0 && (
            <Alert
              type="info"
              title="Liberación de Cheques Retenidos"
              message={`Al registrar el oficio, ${heldPaymentsCount} cheque(s) retenido(s) pasarán automáticamente a estado Pagado.`}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputText
              label="Número de Oficio"
              type="text"
              placeholder="Ej. OFI-2026-045"
              maxLength={100}
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              isRequired
              {...register("official_letter_number", {
                required: "El número de oficio es obligatorio",
                maxLength: {
                  value: 100,
                  message: "No puede exceder 100 caracteres",
                },
              })}
              error={errors.official_letter_number?.message}
            />

            <Controller
              name="official_letter_date"
              control={control}
              rules={{
                required: "La fecha del oficio es obligatoria",
              }}
              render={({ field }) => (
                <DatePicker
                  fieldWidth="large"
                  label="Fecha de Oficio"
                  className="w-full"
                  labelAbove
                  isRequired
                  labelClassName={deductionLabelClassName}
                  value={toDayjsValue(field.value)}
                  onChange={(val) => field.onChange(toDateOnly(val))}
                  error={errors.official_letter_date?.message}
                  slotProps={DATE_PICKER_MODAL_SLOT_PROPS}
                />
              )}
            />

            <div className="sm:col-span-2">
              <InputText
                label="Nombre del Beneficiario"
                type="text"
                placeholder="Nombre completo del beneficiario"
                className={deductionInputClassName}
                labelClassName={deductionLabelClassName}
                {...register("beneficiary_name")}
              />
            </div>

            <div className="sm:col-span-2">
              <PdfUploader
                label="Oficio Judicial (PDF, opcional)"
                fileName={attachment.fileName}
                onChange={setAttachment}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={deductionModalFooterClassName}>
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            type="button"
            label="Cancelar"
            icon={<BanIcon size={16} />}
            disabled={RegisterChildSupportOfficialLetter.isPending}
            onClick={onBack}
            className={`${deductionCancelOutlineClassName} w-full min-w-0 sm:w-auto`}
          />
          <Button
            type="submit"
            label="Guardar Oficio"
            icon={<CheckIcon size={16} />}
            disabled={!isValid || RegisterChildSupportOfficialLetter.isPending}
            isLoading={RegisterChildSupportOfficialLetter.isPending}
            className={`${deductionApproveButtonClassName} w-full min-w-0 sm:w-auto`}
          />
        </div>
      </div>
    </form>
  );
}
