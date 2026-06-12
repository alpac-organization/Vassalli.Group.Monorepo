import { useCallback, useEffect, useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Modal, RadioButton } from "@alpac/design-system";
import { usePermission } from "@app/modules/payroll/ui/hooks/permission/usePermission";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { CollaboratorSummary } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/collaborator-summary";
import { NewPermissionRequestForm } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/new-permission-form";
import { RoleEnum } from "@app/core/enums/role.enum";
import { CollaboratorSearchForm } from "@app/modules/payroll/ui/pages/permissions/components/collaborator-search-form/collaborator-search-form";
import { ChannelEnum } from "@app/core/enums/channel.enum";

import type { CreatePermissionRequestBase } from "@app/modules/payroll/domain/ApiContract/Requests/permission-requests/create-permission-request";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { NewPermissionRequestModalProps } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/types/permission-modal.types";
import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/collaborator-responses/get-collaborator-profile.response";

type ManagerRequestTarget = "self" | "other";

const formTransition = {
  height: { duration: 0.3, ease: "easeInOut" as const },
  opacity: { duration: 0.45, ease: "easeOut" as const, delay: 0.1 },
  y: { duration: 0.3, ease: "easeOut" as const, delay: 0.1 },
};

export function NewPermissionRequestModal({
  isOpen,
  onClose,
  payrollId,
  collaboratorFullName,
  collaboratorWorkPosition,
  isCollaboratorFullNameLoading = false,
  isCollaboratorWorkPositionLoading = false,
  onRequestSuccess,
  onRequestError,
}: NewPermissionRequestModalProps) {
  const { companyId, moduleCode, identificationNumber, role } = useUserStore();
  const { createPermissionRequestMutation } = usePermission();
  const [foundCollaborator, setFoundCollaborator] =
    useState<GetCollaboratorProfileDetailsResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [managerTarget, setManagerTarget] =
    useState<ManagerRequestTarget | null>(null);

  const isManager = role === RoleEnum.MANAGER;
  const isAdministrator = role === RoleEnum.ADMINISTRATOR;
  const isOperator = role === RoleEnum.OPERATOR;
  const channel = useMemo(() => {
    if (isOperator || (isManager && managerTarget === "self")) {
      console.log("PersonalPanel");
      return ChannelEnum.PersonalPanel;
    }
    if (isManager && managerTarget === "other") {
      console.log("manager");
      return ChannelEnum.PersonalPanel;
    }
    console.log("channel admin");
    return ChannelEnum.AdministrativePanel;
  }, [isOperator, isManager, managerTarget]);
  console.log(channel);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setFoundCollaborator(null);
      setManagerTarget(null);
      setIsSearching(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleValidationError = useCallback(
    (message: string) => {
      onRequestError?.(message);
      onClose?.();
    },
    [onRequestError, onClose],
  );

  const handlePermissionSubmit = (payload: CreatePermissionRequestBase) => {
    createPermissionRequestMutation.mutate(payload, {
      onSuccess: () => {
        onClose?.();
        onRequestSuccess?.("Solicitud de permiso creada exitosamente");
      },
      onError: (err) => {
        const apiError = err as unknown as ApiErrorResponse;
        onRequestError?.(
          apiError.error?.description ?? "Ocurrió un error inesperado.",
        );
        onClose?.();
      },
    });
  };

  const handleManagerTargetChange = (target: ManagerRequestTarget) => {
    setManagerTarget(target);
    setFoundCollaborator(null);
    setIsSearching(false);
  };

  const handleClearCollaborator = useCallback(() => {
    setFoundCollaborator(null);
    setIsSearching(false);
  }, []);

  const targetIdentification = useMemo(() => {
    if (isOperator || (isManager && managerTarget === "self")) {
      return identificationNumber;
    }
    return foundCollaborator?.personal_information?.identification_number ?? "";
  }, [
    isOperator,
    isManager,
    managerTarget,
    identificationNumber,
    foundCollaborator,
  ]);

  const showPermissionForm = useMemo(() => {
    if (isOperator) return true;
    if (isManager && managerTarget === "self") return true;
    if (isManager && managerTarget === "other" && foundCollaborator)
      return true;
    if (isAdministrator && foundCollaborator) return true;
    return false;
  }, [
    isOperator,
    isManager,
    isAdministrator,
    managerTarget,
    foundCollaborator,
  ]);

  const showSelfSummary =
    isOperator || (isManager && managerTarget === "self") || isAdministrator;

  const displayFullName = useMemo(() => {
    if (isOperator || (isManager && managerTarget === "self")) {
      return collaboratorFullName ?? "";
    }
    return foundCollaborator?.full_name ?? "";
  }, [
    isOperator,
    isManager,
    managerTarget,
    collaboratorFullName,
    foundCollaborator,
  ]);

  const displayWorkPosition = useMemo(() => {
    if (isOperator || (isManager && managerTarget === "self")) {
      return collaboratorWorkPosition ?? "";
    }
    return foundCollaborator?.work_position ?? "";
  }, [
    isOperator,
    isManager,
    managerTarget,
    collaboratorWorkPosition,
    foundCollaborator,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      variant="form"
      onClose={() => onClose?.()}
      title="Nueva Solicitud de Permiso"
      size="4xl"
      panelClassName={["dark:bg-[#272b34]"].join(" ")}
    >
      <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
        {isManager && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-medium text-black dark:text-white">
              ¿Para quién es la solicitud?
            </legend>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
              <RadioButton
                name="manager-request-target"
                value="self"
                checked={managerTarget === "self"}
                onChange={() => handleManagerTargetChange("self")}
                label="Para mí"
              />
              <RadioButton
                name="manager-request-target"
                value="other"
                checked={managerTarget === "other"}
                onChange={() => handleManagerTargetChange("other")}
                label="Para otro colaborador"
              />
            </div>
          </fieldset>
        )}

        {isManager && managerTarget === "other" && !foundCollaborator && (
          <CollaboratorSearchForm
            onSuccess={(collaborator) => {
              setFoundCollaborator(collaborator);
              setIsSearching(false);
            }}
            onError={() => {
              setIsSearching(false);
              setFoundCollaborator(null);
            }}
            onSearchStart={() => {
              setIsSearching(true);
            }}
            excludeIdentifications={[identificationNumber]}
          />
        )}

        {isManager && managerTarget === "other" && foundCollaborator && (
          <div className="relative flex w-full flex-row items-center gap-4">
            <div className="min-w-0 flex-1">
              <CollaboratorSummary
                fullName={displayFullName}
                workPosition={displayWorkPosition}
                isFullNameLoading={isSearching}
                isWorkPositionLoading={isSearching}
              />
            </div>
            <div className="group flex items-center">
              <button
                type="button"
                className="rounded-full p-1.5 text-slate-700 transition-all hover:bg-slate-300 hover:text-slate-900 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
                onClick={handleClearCollaborator}
                aria-label="Quitar Colaborador"
              >
                <X size={20} />
              </button>
              <div className="pointer-events-none absolute -top-10 right-0 z-50 mt-2 rounded bg-slate-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                Quitar Colaborador
              </div>
            </div>
          </div>
        )}

        {isAdministrator && !foundCollaborator && (
          <CollaboratorSearchForm
            onSuccess={(collaborator) => {
              setFoundCollaborator(collaborator);
              setIsSearching(false);
            }}
            onError={() => {
              setIsSearching(false);
              setFoundCollaborator(null);
            }}
            onSearchStart={() => {
              setIsSearching(true);
            }}
            excludeIdentifications={[identificationNumber]}
          />
        )}

        <AnimatePresence initial={!isOperator}>
          {showPermissionForm && (
            <m.div
              key="permission-form-section"
              initial={{ opacity: 0, y: 16, height: 0, overflow: "hidden" }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                overflow: "visible",
              }}
              exit={{ opacity: 0, y: 8, height: 0, overflow: "hidden" }}
              transition={formTransition}
              className="flex flex-col gap-4 sm:gap-5"
            >
              {showSelfSummary && (
                <CollaboratorSummary
                  fullName={displayFullName}
                  workPosition={displayWorkPosition}
                  isFullNameLoading={
                    isCollaboratorFullNameLoading || isSearching
                  }
                  isWorkPositionLoading={
                    isCollaboratorWorkPositionLoading || isSearching
                  }
                />
              )}

              <NewPermissionRequestForm
                payrollId={payrollId}
                isPending={createPermissionRequestMutation.isPending}
                onSubmit={handlePermissionSubmit}
                onCancel={() => onClose?.()}
                onValidationError={handleValidationError}
                companyId={companyId}
                moduleCode={moduleCode}
                identificationNumber={targetIdentification}
                channel={channel}
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
