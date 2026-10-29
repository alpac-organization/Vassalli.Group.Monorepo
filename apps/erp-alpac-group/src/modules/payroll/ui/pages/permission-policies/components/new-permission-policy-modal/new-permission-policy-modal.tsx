import { useEffect, useMemo } from "react";
import { Banner, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { usePermissionPolicies } from "@app/modules/payroll/ui/hooks/permission/usePermissionPolicies";
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import type { CreatePermissionPoliciesRequest } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-policies";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { NewPermissionPolicyModalProps } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import { NewPermissionPolicyForm } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/new-permission-policy-form";

export function NewPermissionPolicyModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: NewPermissionPolicyModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const context = useMemo(() => {
    if (!companyId || !moduleCode) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
    };
  }, [companyId, moduleCode]);

  const { formsQuery, createPermissionPoliciesMutation } =
    usePermissionPolicies(context, {
      enablePolicies: false,
      enableForms: true,
    });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (payload: CreatePermissionPoliciesRequest) => {
    createPermissionPoliciesMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        onSuccess?.("Política de permiso registrada exitosamente");
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        onError?.(
          apiError.error?.description ?? "Ocurrió un error inesperado.",
        );
        onClose();
      },
    });
  };

  const formsReady = formsQuery.isSuccess && formsQuery.data != null;
  const formsError = formsQuery.isError;

  return (
    <Modal
      isOpen={isOpen}
      variant="form"
      onClose={onClose}
      title="Nueva política de permiso"
      description="Configure las reglas aplicables al tipo de permiso seleccionado"
      size="4xl"
      panelClassName="dark:bg-[#272b34]"
    >
      {formsQuery.isPending ? (
        <Loader title="Cargando catálogos..." />
      ) : null}

      {formsError ? (
        <Banner
          variant="error"
          title="Error al cargar catálogos"
          description={getErrorMessage(formsQuery.error)}
        />
      ) : null}

      {formsReady && companyId && moduleCode ? (
        <NewPermissionPolicyForm
          isPending={createPermissionPoliciesMutation.isPending}
          permitTypes={formsQuery.data.permit_types}
          beneficiaryScopes={formsQuery.data.beneficiary_scopes}
          familyRelationships={formsQuery.data.family_relationships}
          companyId={companyId}
          moduleCode={moduleCode}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      ) : null}
    </Modal>
  );
}
