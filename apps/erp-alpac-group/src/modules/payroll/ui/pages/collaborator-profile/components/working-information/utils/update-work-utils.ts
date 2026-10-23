import { useState, useEffect } from "react";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import type {
  UpdateCollaboratorProfileDetailsRequest,
  UpdateWorkingInformationRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/update-collaborator-request";

interface UseUpdateWorkInformationProps {
  companyId?: string;
  moduleCode?: string;
  targetIdentification: string;
  resolvedMaritalStatusCode: number | null;
}

export const useUpdateWorkInformation = ({
  companyId,
  moduleCode,
  targetIdentification,
  resolvedMaritalStatusCode,
}: UseUpdateWorkInformationProps) => {
  const { UpdateCollaboratorProfileDetails } = useCollaborators({});

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alertInfo) {
      const timer = setTimeout(() => setAlertInfo(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const buildBasePayload =
    (): UpdateCollaboratorProfileDetailsRequest | null => {
      if (!companyId?.trim() || !moduleCode?.trim() || !targetIdentification) {
        setAlertInfo({
          type: "error",
          title: "Error",
          message: "Falta contexto de empresa o identificación.",
        });
        return null;
      }

      return {
        company_id: companyId,
        module_code: moduleCode,
        identification_number: targetIdentification,
        ...(resolvedMaritalStatusCode !== null
          ? {
            personal_information: {
              marital_status: resolvedMaritalStatusCode,
            },
          }
          : {}),
      };
    };

  const persist = async (payload: UpdateCollaboratorProfileDetailsRequest) => {
    try {
      await UpdateCollaboratorProfileDetails.mutateAsync(payload);
      setAlertInfo({
        type: "success",
        title: "¡Éxito!",
        message: "Actualizado correctamente.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: getErrorMessage(error) ?? "No se pudo actualizar.",
      });
    }
  };

  const mapWorkingField = (
    name: string,
    value: string,
  ): UpdateWorkingInformationRequest | null => {
    switch (name) {
      case "workEmail":
        return { work_email: value.trim() };
      case "workPhoneNumber":
        return { work_phone_number: value.trim() };
      case "branchId":
        return { branch_id: value.trim() };
      case "bankId":
        return { bank_id: value.trim() };
      case "inssNumber":
        return { inss_number: value.trim() };
      case "bankAccountNumber":
        return { bank_account_number: value.trim() };
      default:
        return null;
    }
  };

  const handleFieldUpdate = async (
    name: string,
    value: string | boolean,
  ) => {
    const base = buildBasePayload();
    if (!base) return;

    if (name === "isTimeClockExempt") {
      await persist({
        ...base,
        is_time_clock_exempt: value === true,
      });
      return;
    }

    const working = mapWorkingField(name, String(value));
    if (!working || Object.keys(working).length === 0) return;

    await persist({
      ...base,
      working_information: working,
    });
  };

  return {
    handleFieldUpdate,
    alertInfo,
    setAlertInfo,
    isUpdating: UpdateCollaboratorProfileDetails.isPending,
  };
};
