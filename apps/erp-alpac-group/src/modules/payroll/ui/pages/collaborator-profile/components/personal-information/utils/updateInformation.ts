import { useEffect, useState } from "react";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/collaborator/useCollaborators";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { normalizeMaritalStatusFromApi } from "@app/modules/payroll/ui/pages/collaborator-profile/components/personal-information/utils/marital-status.utils";
import type {
  UpdateCollaboratorProfileDetailsRequest,
  UpdatePersonalInformationRequest,
} from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/update-collaborator-request";

const ROOT_NAME_FIELDS = [
  "first_name",
  "second_name",
  "third_name",
  "first_surname",
  "second_surname",
] as const;

type RootNameField = (typeof ROOT_NAME_FIELDS)[number];

function isRootNameField(name: string): name is RootNameField {
  return (ROOT_NAME_FIELDS as readonly string[]).includes(name);
}

interface UseUpdatePersonalInformationProps {
  companyId?: string;
  moduleCode?: string;
  targetIdentification: string;
  resolvedMaritalStatusCode: number | null;
}

export const useUpdatePersonalInformation = ({
  companyId,
  moduleCode,
  targetIdentification,
  resolvedMaritalStatusCode,
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

    const base: UpdateCollaboratorProfileDetailsRequest = {
      company_id: companyId,
      module_code: moduleCode,
      identification_number: targetIdentification,
    };

    try {
      if (isRootNameField(name)) {
        const body: UpdateCollaboratorProfileDetailsRequest = {
          ...base,
          [name]: String(value),
        };
        if (resolvedMaritalStatusCode !== null) {
          body.personal_information = {
            marital_status: resolvedMaritalStatusCode,
          };
        }
        await UpdateCollaboratorProfileDetails.mutateAsync(body);
      } else {
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

        if (name !== "marital_status" && resolvedMaritalStatusCode !== null) {
          payload.marital_status = resolvedMaritalStatusCode;
        }

        await UpdateCollaboratorProfileDetails.mutateAsync({
          ...base,
          personal_information: payload,
        });
      }

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
