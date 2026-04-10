import { useEffect, useState } from "react";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { normalizeMaritalStatusFromApi } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";
import type { UpdatePersonalInformationRequest } from "@app/modules/payroll/domain/ApiContract/Requests/update-collaborator-request";

interface UseUpdatePersonalInformationProps {
  companyId?: string;
  moduleCode?: string;
  targetIdentification: string;
}

export const useUpdatePersonalInformation = ({
  companyId,
  moduleCode,
  targetIdentification,
}: UseUpdatePersonalInformationProps) => {
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
  const handleFieldUpdate = async (name: string, value: string | number) => {
    if (!companyId?.trim() || !moduleCode?.trim() || !targetIdentification) {
      setAlertInfo({
        type: "error",
        title: "Error",
        message: "Falta contexto de empresa o identificación.",
      });
      return;
    }

    try {
      const payload: UpdatePersonalInformationRequest = {};
      switch (name) {
        case "personalEmail":
          payload.personal_email = String(value);
          break;
        case "personalPhone":
          payload.personal_phone_number = String(value);
          break;
        case "address":
          payload.address = String(value);
          break;
        case "marital_status": {
          const numericValue = normalizeMaritalStatusFromApi(value);
          if (numericValue !== null) payload.marital_status = numericValue;
          break;
        }
        case "department_id":
          payload.departament_id = Number(value);
          break;
        default:
          return;
      }
      console.log(payload);
      await UpdateCollaboratorProfileDetails.mutateAsync({
        company_id: companyId,
        module_code: moduleCode,
        identification_number: targetIdentification,
        personal_information: payload,
      });

      setAlertInfo({
        type: "success",
        title: "¡Éxito!",
        message: "El campo se actualizó correctamente.",
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
