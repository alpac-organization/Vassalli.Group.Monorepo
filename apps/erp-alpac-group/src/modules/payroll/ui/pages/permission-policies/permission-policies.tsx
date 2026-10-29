import {
  Banner,
  Breadcrumb,
  Button,
  Dropdown,
  SectionHeader,
  useTheme,
  type Option,
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
import { Loader } from "@app/shared/components/loaders/loader";
import { getErrorMessage } from "@app/modules/payroll/ui/pages/collaborator-profile/utils/get-error-message";
import { usePermissionPolicies } from "@app/modules/payroll/ui/hooks/permission/usePermissionPolicies";
import { PermissionPoliciesTable } from "@app/modules/payroll/ui/pages/permission-policies/components/permission-policies-table/permission-policies-table";
import type { NewPermissionPolicyModalProps } from "@app/modules/payroll/ui/pages/permission-policies/components/new-permission-policy-modal/types/permission-policy-form.types";

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

type ActiveFilterValue = "all" | "active" | "inactive";

const ACTIVE_FILTER_OPTIONS: Option[] = [
  { label: "Todas", value: "all" },
  { label: "Activas", value: "active" },
  { label: "Inactivas", value: "inactive" },
];

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const labelClassName = "text-black! dark:text-white!";

export const PermissionPoliciesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { companyId, moduleCode } = useUserStore();
  const { baseUrl } = useBaseUrl();
  const { handleRequestSuccess, handleRequestError, AlertComponent } =
    useAlertState();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
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

  const { policiesQuery } = usePermissionPolicies(context, {
    enablePolicies: true,
    enableForms: false,
  });

  const policies = policiesQuery.data ?? [];

  const typeFilterOptions = useMemo<Option[]>(() => {
    const uniqueTypes = new Map<string, string>();
    for (const policy of policies) {
      const typeValue = String(policy.permit_application_type ?? "");
      if (!typeValue || uniqueTypes.has(typeValue)) continue;

      uniqueTypes.set(
        typeValue,
        policy.permit_application_type_label || typeValue,
      );
    }

    return [
      { label: "Todos los tipos", value: "all" },
      ...Array.from(uniqueTypes.entries()).map(([value, label]) => ({
        value,
        label,
      })),
    ];
  }, [policies]);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesType =
        appliedType === "all" ||
        String(policy.permit_application_type) === appliedType;
      const matchesActive =
        appliedActive === "all" ||
        (appliedActive === "active" && policy.is_active) ||
        (appliedActive === "inactive" && !policy.is_active);
      return matchesType && matchesActive;
    });
  }, [policies, appliedType, appliedActive]);

  const handleApplyFilters = useCallback(() => {
    setAppliedType(typeDraft);
    setAppliedActive(activeDraft);
  }, [typeDraft, activeDraft]);

  const handleClearFilters = useCallback(() => {
    setTypeDraft("all");
    setActiveDraft("all");
    setAppliedType("all");
    setAppliedActive("all");
  }, []);

  if (!companyId || !moduleCode) {
    return (
      <Banner
        variant="error"
        title="Contexto de sesión incompleto"
        description="No se encontró la empresa o el módulo activo para cargar las políticas."
      />
    );
  }

  if (policiesQuery.isPending) {
    return <Loader title="Cargando políticas de permisos..." />;
  }

  if (policiesQuery.isError) {
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
            onClick={() => setIsCreateOpen(true)}
          />
        </SectionHeader>

        <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Filtros</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Filtra por tipo de permiso o estado de la política
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
            options={typeFilterOptions}
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

        <PermissionPoliciesTable data={filteredPolicies} />

        {isCreateOpen ? (
          <Suspense fallback={<Loader title="Cargando formulario..." />}>
            <NewPermissionPolicyModal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onSuccess={handleRequestSuccess}
              onError={handleRequestError}
            />
          </Suspense>
        ) : null}
      </m.div>

      {AlertComponent}
    </LazyMotion>
  );
};
