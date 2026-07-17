import {
  Breadcrumb,
  Button,
  Dropdown,
  InputText,
  Pagination,
  useTheme,
} from "@alpac/design-system";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { useCompanies } from "@app/modules/auth/ui/hooks/useCompanies";
import type { GetSubsidyHistoryRequest } from "@app/modules/payroll/domain/ApiContract/Requests/subsidy-requests/get-subsidy-history.request";
import { Loader } from "@app/shared/components/loaders/loader";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSubsidy } from "@app/modules/payroll/ui/hooks/subsidy/useSubsidy";
import { SubsidyHistoryTable } from "./components/subsidy-history-table/subsidy-history-table";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

const PAGE_SIZE = 10;

type SubsidyHistoryFilterForm = {
  collaborator_code: string;
  branch_id: string;
  area_id: string;
};

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

export const SubsidyHistoryPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId, moduleCode } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { baseUrl } = useBaseUrl();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const { GetBranchesQuery: branchesQuery } = useCompanies(
    companyId ? { company_id: companyId } : undefined,
  );

  const { GetAreasByCompany: areasQuery } = useAreas({
    company_id: companyId ?? "",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<SubsidyHistoryFilterForm>({
    mode: "onChange",
    defaultValues: {
      collaborator_code: "",
      branch_id: "",
      area_id: "",
    },
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedCollaboratorCode, setAppliedCollaboratorCode] = useState("");
  const [appliedBranchId, setAppliedBranchId] = useState("");
  const [appliedAreaId, setAppliedAreaId] = useState("");

  const filters = useMemo<GetSubsidyHistoryRequest | undefined>(() => {
    if (!companyId || !moduleCode) return undefined;

    return {
      companie_id: companyId,
      module_code: moduleCode,
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedCollaboratorCode.trim() && {
        collaborator_code: appliedCollaboratorCode.trim(),
      }),
      ...(appliedBranchId && { branch_id: appliedBranchId }),
      ...(appliedAreaId && { area_id: appliedAreaId }),
    };
  }, [
    companyId,
    moduleCode,
    pageNumber,
    appliedCollaboratorCode,
    appliedBranchId,
    appliedAreaId,
  ]);

  const { GetSubsidyHistory } = useSubsidy({
    subsidyHistoryPayload: filters,
  });

  const { isLoading, isFetching } = GetSubsidyHistory;

  const subsidyHistoryRows = useMemo(
    () => GetSubsidyHistory.data?.data ?? [],
    [GetSubsidyHistory.data],
  );

  const branchOptions = useMemo(
    () =>
      (branchesQuery.data ?? []).map((branch) => ({
        label: branch.branch_name,
        value: branch.branch_id,
      })),
    [branchesQuery.data],
  );

  const areaOptions = useMemo(
    () =>
      (areasQuery.data ?? []).map((area) => ({
        label: area.work_area_name,
        value: area.work_area_id,
      })),
    [areasQuery.data],
  );

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const onSubmit: SubmitHandler<SubsidyHistoryFilterForm> = useCallback(
    (data) => {
      setAppliedCollaboratorCode(data.collaborator_code?.trim() ?? "");
      setAppliedBranchId(data.branch_id || "");
      setAppliedAreaId(data.area_id || "");
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    reset({
      collaborator_code: "",
      branch_id: "",
      area_id: "",
    });
    setAppliedCollaboratorCode("");
    setAppliedBranchId("");
    setAppliedAreaId("");
    setPageNumber(1);
  }, [reset]);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      {isLoading && <Loader title="Cargando historial de subsidios..." />}

      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Historial de Subsidio",
              url: `${baseUrl}/payroll/subsidy-history`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Historial de Subsidio</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Consulta los subsidios registrados por colaborador
            </small>
          </div>
          <img
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            src={activeLogo}
            alt="logo alpac"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Filtra por código de colaborador, sucursal o área de trabajo
          </small>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end"
      >
        <div className="flex flex-col">
          <InputText
            label="Código de colaborador"
            className={inputClassName}
            labelClassName={labelClassName}
            type="text"
            placeholder="Ingrese el código del colaborador"
            errorVariant="tooltip"
            {...register("collaborator_code", {
              required: false,
              setValueAs: (value: string) => value?.trim() ?? "",
            })}
            error={errors.collaborator_code?.message}
          />
        </div>

        <div className="flex flex-col">
          <Controller
            name="branch_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Sucursal"
                appearance="dark"
                placeholder="Todas las sucursales"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={branchOptions}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={dropdownClassName}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <Controller
            name="area_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                label="Área de trabajo"
                appearance="dark"
                placeholder="Todas las áreas"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={areaOptions}
                labelClassName={labelClassName}
                valueClassName={labelClassName}
                className={dropdownClassName}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          <Button
            type="submit"
            size="giant"
            disabled={!isValid || !isDirty}
            className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            label="Aplicar filtros"
          />
        </div>

        <div className="flex flex-col">
          <Button
            type="button"
            size="giant"
            className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
            label="Limpiar filtros"
            onClick={handleClearFilters}
          />
        </div>
      </form>

      <div className="flex flex-col">
        <SubsidyHistoryTable
          data={subsidyHistoryRows}
          pagination={
            <Pagination
              currentPage={GetSubsidyHistory.data?.page_number ?? pageNumber}
              pageSize={GetSubsidyHistory.data?.page_size ?? PAGE_SIZE}
              totalRecords={GetSubsidyHistory.data?.total ?? 0}
              onPageChange={handlePageChange}
              disabled={isFetching}
            />
          }
        />
      </div>
    </m.div>
  );
};
