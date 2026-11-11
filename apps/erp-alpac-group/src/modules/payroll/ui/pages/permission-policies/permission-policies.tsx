import {
  Banner,
  Breadcrumb,
  Button,
  Dropdown,
  Modal,
  Pagination,
  SectionHeader,
  useTheme,
} from "@alpac/design-system";
import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useState,
  type ComponentType,
} from "react";
import { m, LazyMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { usePermissionPolicies } from "@app/modules/payroll/ui/hooks/permission/usePermissionPolicies";
import { PermissionPoliciesTable } from "@app/modules/payroll/ui/pages/permission-policies/components/permission-policies-table/permission-policies-table";
import { PermitApplicationTypeEnum } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import type { GetPermissionPoliciesResponse } from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/get-permission-policies";
import type { NewPermissionPolicyModalProps } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";
import { 
  PAGE_SIZE, TYPE_FILTER_OPTIONS,
  ACTIVE_FILTER_OPTIONS, labelClassName,
  dropdownClassName } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/constants/permission-policy-form.constants";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const NewPermissionPolicyModal = lazy(() =>
  import(
    "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/new-permission-policy-modal"
  ).then((module) => ({
    default: module.NewPermissionPolicyModal as ComponentType<
      NewPermissionPolicyModalProps
    >,
  })),
);

type ActiveFilterValue = "all" | "active";


export const PermissionPoliciesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { companyId, moduleCode } = useUserStore();
  const { baseUrl } = useBaseUrl();
  const { handleRequestSuccess, handleRequestError, AlertComponent } =
    useAlertState();
  const { getMappedError } = useMappedError();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] =
    useState<GetPermissionPoliciesResponse | null>(null);
  const [pendingStatusPolicy, setPendingStatusPolicy] =
    useState<GetPermissionPoliciesResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [typeDraft, setTypeDraft] = useState<string>("all");
  const [activeDraft, setActiveDraft] = useState<ActiveFilterValue>("all");
  const [appliedType, setAppliedType] = useState<string>("all");
  const [appliedActive, setAppliedActive] =
    useState<ActiveFilterValue>("all");

  const context = useMemo(() => {
    if (!companyId || !moduleCode) return undefined;
    return {
      company_id: companyId,
      module_code: moduleCode,
    };
  }, [companyId, moduleCode]);

  const permitApplicationType = useMemo(() => {
    if (appliedType === "all") return undefined;
    const entry = PermitApplicationTypeEnum[appliedType];
    return entry ? Number(entry.value) : undefined;
  }, [appliedType]);

  const { policiesQuery, updatePermitTypePolicyMutation } =
    usePermissionPolicies(
      context,
      {
        enablePolicies: true,
        enableForms: false,
      },
      {
        onlyActive: appliedActive === "active",
        permitApplicationType,
        pageNumber,
        pageSize: PAGE_SIZE,
      },
    );

  const policies = policiesQuery.data?.data ?? [];

  const handleApplyFilters = useCallback(() => {
    setAppliedType(typeDraft);
    setAppliedActive(activeDraft);
    setPageNumber(1);
  }, [typeDraft, activeDraft]);

  const handleClearFilters = useCallback(() => {
    setTypeDraft("all");
    setActiveDraft("all");
    setAppliedType("all");
    setAppliedActive("all");
    setPageNumber(1);
  }, []);

  const handleUpdatePolicy = useCallback(
    (row: GetPermissionPoliciesResponse) => {
      setEditingPolicy(row);
      setIsCreateOpen(false);
    },
    [],
  );

  const handleRequestStatusChange = useCallback(
    (row: GetPermissionPoliciesResponse) => {
      setPendingStatusPolicy(row);
    },
    [],
  );

  const handleCloseStatusModal = useCallback(() => {
    setPendingStatusPolicy(null);
  }, []);

  const handleConfirmStatusChange = useCallback(() => {
    if (!pendingStatusPolicy || !companyId || !moduleCode) return;

    const nextIsActive = !pendingStatusPolicy.is_active;
    updatePermitTypePolicyMutation.mutate(
      {
        company_id: companyId,
        module_code: moduleCode,
        permit_type_policy_id: pendingStatusPolicy.permit_type_policy_id,
        is_active: nextIsActive,
      },
      {
        onSuccess: () => {
          setPendingStatusPolicy(null);
          handleRequestSuccess(
            `Política ${nextIsActive ? "activada" : "desactivada"} exitosamente`,
          );
        },
        onError: (err) => {
          handleRequestError(
            getMappedError(err as ApiErrorResponse).description,
          );
        },
      },
    );
  }, [
    companyId,
    getMappedError,
    handleRequestError,
    handleRequestSuccess,
    moduleCode,
    pendingStatusPolicy,
    updatePermitTypePolicyMutation,
  ]);

  const statusModalTitle = pendingStatusPolicy?.is_active
    ? "Desactivar política"
    : "Activar política";

  const statusModalDescription = pendingStatusPolicy
    ? `¿Desea ${pendingStatusPolicy.is_active ? "desactivar" : "activar"} la política "${pendingStatusPolicy.permit_application_type_label || "seleccionada"}"?`
    : "";

  if (!companyId || !moduleCode) {
    return (
      <Banner
        variant="error"
        title="Contexto de sesión incompleto"
        description="No se encontró la empresa o el módulo activo para cargar las políticas."
      />
    );
  }

  if (policiesQuery.isPending && !policiesQuery.data) {
    return <Loader title="Cargando políticas de permisos..." />;
  }

  if (policiesQuery.isError && !policiesQuery.data) {
    return (
      <Banner
        variant="error"
        title="Error al cargar las políticas de permisos"
        description={getErrorMessage(policiesQuery.error)}
      />
    );
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6"
      >
        <div className="flex justify-start">
          <Breadcrumb
            items={[
              {
                label: "Dashboard",
                url: `${baseUrl}/`,
                onClick: (url) => navigate(url),
              },
              {
                label: "Políticas de Permisos",
                url: `${baseUrl}/payroll/permission-policies`,
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <SectionHeader
          title="Políticas de Permisos"
          subtitle="Administre las reglas aplicables a cada tipo de permiso"
          logoImage={activeLogo}
        >
          <Button
            size="giant"
            label="Nueva política"
            icon={<Plus size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => {
              setEditingPolicy(null);
              setIsCreateOpen(true);
            }}
          />
        </SectionHeader>

        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Filtros</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Filtra por tipo de permiso o solo políticas activas
            </small>
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Dropdown
            label="Tipo de permiso"
            appearance="dark"
            placeholder="Todos los tipos"
            value={typeDraft}
            onChange={(value) => setTypeDraft(String(value))}
            options={TYPE_FILTER_OPTIONS}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={dropdownClassName}
          />

          <Dropdown
            label="Estado"
            appearance="dark"
            placeholder="Todas"
            value={activeDraft}
            onChange={(value) =>
              setActiveDraft(value as ActiveFilterValue)
            }
            options={ACTIVE_FILTER_OPTIONS}
            labelClassName={labelClassName}
            valueClassName={labelClassName}
            className={dropdownClassName}
          />

          <Button
            type="button"
            size="giant"
            label="Aplicar filtros"
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={handleApplyFilters}
          />

          <Button
            type="button"
            size="giant"
            label="Limpiar filtros"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            onClick={handleClearFilters}
          />
        </div>

        {policiesQuery.isError ? (
          <Banner
            variant="error"
            title="Error al cargar las políticas de permisos"
            description={getErrorMessage(policiesQuery.error)}
          />
        ) : null}

        <PermissionPoliciesTable
          data={policies}
          pagination={
            <Pagination
              currentPage={policiesQuery.data?.page_number ?? pageNumber}
              pageSize={policiesQuery.data?.page_size ?? PAGE_SIZE}
              totalRecords={policiesQuery.data?.total ?? 0}
              onPageChange={setPageNumber}
              disabled={
                policiesQuery.isFetching ||
                updatePermitTypePolicyMutation.isPending
              }
            />
          }
          onUpdate={handleUpdatePolicy}
          onRequestStatusChange={handleRequestStatusChange}
        />

        {isCreateOpen || editingPolicy ? (
          <Suspense fallback={<Loader title="Cargando formulario..." />}>
            <NewPermissionPolicyModal
              isOpen
              policy={editingPolicy}
              onClose={() => {
                setIsCreateOpen(false);
                setEditingPolicy(null);
              }}
              onSuccess={handleRequestSuccess}
              onError={handleRequestError}
            />
          </Suspense>
        ) : null}
      </m.div>

      <Modal
        isOpen={pendingStatusPolicy != null}
        onClose={handleCloseStatusModal}
        variant="warning"
        size="md"
        title={statusModalTitle}
        description={statusModalDescription}
        panelClassName="dark:bg-[#272b34]"
      >
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            className="fw-ull! sm:w-auto! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            disabled={updatePermitTypePolicyMutation.isPending}
            onClick={handleCloseStatusModal}
          />
          <Button
            type="button"
            size="giant"
            label="Confirmar"
            disabled={updatePermitTypePolicyMutation.isPending}
            className="w-full! sm:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={handleConfirmStatusChange}
          />
        </div>
      </Modal>

      {AlertComponent}
    </LazyMotion>
  );
};
