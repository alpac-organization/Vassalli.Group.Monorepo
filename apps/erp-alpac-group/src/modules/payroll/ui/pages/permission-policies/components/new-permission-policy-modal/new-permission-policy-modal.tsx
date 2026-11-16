import { useEffect, useMemo } from "react";
import { Banner, Modal } from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { usePermissionPolicies } from "@app/modules/payroll/ui/hooks/permission/usePermissionPolicies";
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import {
  buildPermissionPolicyPayload,
  buildPermissionPolicyUpdatePayload,
  hasPolicyUpdateChanges,
  policyToFormValues,
} from "@app/modules/payroll/ui/pages/permission-policies/utils/build-permission-policy-payload";
import type {
  NewPermissionPolicyModalProps,
  PermissionPolicyFormValues,
} from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import { NewPermissionPolicyForm } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/new-permission-policy-form";

export function NewPermissionPolicyModal({
  isOpen,
  policy = null,
  onClose,
  onSuccess,
  onError,
}: NewPermissionPolicyModalProps) {
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();
  const isEditing = policy != null;

  const context = useMemo(() => {
    if (!companyId || !moduleCode) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
    };
  }, [companyId, moduleCode]);

  const { formsQuery, createPermissionPoliciesMutation, updatePermitTypePolicyMutation } =
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

  const catalogs = useMemo(() => {
    if (!formsQuery.data) return null;
    return {
      permitTypes: formsQuery.data.permit_types,
      beneficiaryScopes: formsQuery.data.beneficiary_scopes,
      familyRelationships: formsQuery.data.family_relationships,
    };
  }, [formsQuery.data]);

  const initialValues = useMemo(
    () => (policy ? policyToFormValues(policy) : undefined),
    [policy],
  );

  const isPending = isEditing
    ? updatePermitTypePolicyMutation.isPending
    : createPermissionPoliciesMutation.isPending;

  const handleSubmit = (values: PermissionPolicyFormValues) => {
    if (!companyId || !moduleCode || !catalogs) return;

    try {
      submitPolicy(values);
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error.message
          : "No se pudo preparar la política.",
      );
    }
  };

  const submitPolicy = (values: PermissionPolicyFormValues) => {
    if (!companyId || !moduleCode || !catalogs) return;

    if (isEditing && policy) {
      const payload = buildPermissionPolicyUpdatePayload({
        companyId,
        moduleCode,
        policy,
        values,
        catalogs,
      });

      const clearedMaxDays =
        policy.max_amount_days != null &&
        policy.max_amount_days > 0 &&
        values.max_amount_days.trim() === "";

      if (!hasPolicyUpdateChanges(payload)) {
        onError?.(
          clearedMaxDays
            ? "El máximo de días vacío no borra el tope. Indique un nuevo valor para cambiarlo."
            : "No hay cambios para guardar.",
        );
        return;
      }

      updatePermitTypePolicyMutation.mutate(payload, {
        onSuccess: () => {
          onClose();
          onSuccess?.(
            clearedMaxDays
              ? "Política actualizada. El máximo de días vacío no borra el tope existente."
              : "Política de permiso actualizada exitosamente",
          );
        },
        onError: (err) => {
          onError?.(getMappedError(err as ApiErrorResponse).description);
        },
      });
      return;
    }

    const payload = buildPermissionPolicyPayload({
      companyId,
      moduleCode,
      values,
      catalogs,
    });

    createPermissionPoliciesMutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        onSuccess?.("Política de permiso registrada exitosamente");
      },
      onError: (err) => {
        onError?.(getMappedError(err as ApiErrorResponse).description);
      },
    });
  };

  const formsReady = formsQuery.isSuccess && catalogs != null;
  const formsError = formsQuery.isError;

  return (
    <Modal
      isOpen={isOpen}
      variant="form"
      onClose={onClose}
      title={isEditing ? "Editar política de permiso" : "Nueva política de permiso"}
      description={
        isEditing
          ? "Actualice solo las reglas que deben cambiar"
          : "Configure las reglas aplicables al tipo de permiso seleccionado"
      }
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
          key={policy?.permit_type_policy_id ?? "create"}
          isPending={isPending}
          permitTypes={catalogs.permitTypes}
          beneficiaryScopes={catalogs.beneficiaryScopes}
          familyRelationships={catalogs.familyRelationships}
          initialValues={initialValues}
          submitLabel={isEditing ? "Guardar cambios" : "Registrar política"}
          requireDirty={isEditing}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      ) : null}
    </Modal>
  );
}
