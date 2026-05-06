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

  const handleFieldUpdate = async (name: string, value: string) => {
    if (!companyId?.trim() || !moduleCode?.trim() || !targetIdentification) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: "Falta contexto de empresa o identificación.",
      });
      return;
    }

    const working: UpdateWorkingInformationRequest = {};

    switch (name) {
      case "workEmail":
        working.work_email = value.trim();
        break;
      case "workPhoneNumber":
        working.work_phone_number = value.trim();
        break;
      case "branchId":
        working.branch_id = value.trim();
        break;
      default:
        return;
    }

    if (Object.keys(working).length === 0) return;

    const payload: UpdateCollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: targetIdentification,
      working_information: working,
      ...(resolvedMaritalStatusCode !== null
        ? {
            personal_information: {
              marital_status: resolvedMaritalStatusCode,
            },
          }
        : {}),
    };

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

  return {
    handleFieldUpdate,
    alertInfo,
    setAlertInfo,
    isUpdating: UpdateCollaboratorProfileDetails.isPending,
  };
};
