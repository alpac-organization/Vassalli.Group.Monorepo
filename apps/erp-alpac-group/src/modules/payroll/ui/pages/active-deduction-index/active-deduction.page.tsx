import {
  Banner,
  Breadcrumb,
  Button,
  Dropdown,
  InputText,
  Pagination,
} from "@alpac/design-system";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import type { GetDeductionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deductions.request";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import { DeductionTypeEnum } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import { Loader } from "@app/shared/components/loaders/loader";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useModulePageHeader } from "@app/shared/hooks/useModulePageHeader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import {
  formatIdentificationNumber,
  validateIdentificationNumber,
} from "@app/shared/utils/string.utils";
import { LazyMotion, m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useDeduction } from "../../hooks/deduction/useDeduction";
import { ActiveDeductionDetailModal } from "./components/active-deduction-detail-modal/active-deduction-detail-modal";
import { ActiveDeductionTable } from "./components/active-deduction-table/active-deduction-table";
import { ChildSupportDetailModal } from "./components/child-support-detail-modal/child-support-detail-modal";
import {
  DEDUCTION_TYPE_FILTER_OPTIONS,
  deductionDropdownClassName,
  deductionInputClassName,
  deductionLabelClassName,
  deductionPrimaryButtonClassName,
  deductionSecondaryButtonClassName,
  isChildSupportDeduction,
} from "./utils/active-deduction.constants";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 5;

type DeductionTypeFilterValue = "all" | keyof typeof DeductionTypeEnum;

type ActiveDeductionFilterForm = {
  identification_number: string;
  type: DeductionTypeFilterValue;
};

export const ActiveDeductionsPage = () => {
  const { companyId, moduleCode } = useUserStore();

  const { activeLogo, breadcrumbItems } = useModulePageHeader((baseUrl) => [
    { label: "Dashboard", url: `${baseUrl}/` },
    { label: "Deducciones Activas", url: `${baseUrl}/active-deductions` },
  ]);

  const { AlertComponent, handleRequestSuccess, handleRequestError } =
    useAlertState();
  const { getMappedError } = useMappedError();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ActiveDeductionFilterForm>({
    mode: "onChange",
    defaultValues: {
      identification_number: "",
      type: "all",
    },
  });

  const { useGetDeductions, useGetDeductionDetails } = useDeduction();

  const [pageNumber, setPageNumber] = useState(1);
  const [appliedType, setAppliedType] =
    useState<DeductionTypeFilterValue>("all");
  const [appliedIdentification, setAppliedIdentification] = useState("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDeduction, setSelectedDeduction] =
    useState<DeductionDto | null>(null);

  const filters = useMemo<GetDeductionsRequest>(
    () => ({
      company_id: companyId,
      module_code: moduleCode,
      status: "Progress",
      page_number: pageNumber,
      page_size: PAGE_SIZE,
      ...(appliedType !== "all" && { type: appliedType }),
      ...(appliedIdentification.trim() && {
        identification_number: appliedIdentification.trim(),
      }),
    }),
    [companyId, moduleCode, pageNumber, appliedType, appliedIdentification],
  );

  const detailFilters = {
    company_id: companyId,
    module_code: moduleCode,
    deduction_id: selectedDeduction?.deduction_id ?? "",
    identification_number: selectedDeduction?.identification_number,
  };

  const {
    data: deductions,
    isLoading,
    isFetching,
    isError: isListError,
    error: listError,
  } = useGetDeductions(filters);

  const listErrorDescription =
    isListError && listError
      ? getMappedError(listError).description ||
        "No se pudo cargar las deducciones activas."
      : null;

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetDeductionDetails(detailFilters, {
    enabled:
      isDetailOpen &&
      !!selectedDeduction?.deduction_id &&
      !!companyId &&
      !!moduleCode,
  });

  const datasource = deductions?.data ?? [];
  const isChildSupportSelected = isChildSupportDeduction(selectedDeduction);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const onSubmit: SubmitHandler<ActiveDeductionFilterForm> = useCallback(
    (data) => {
      setAppliedType(data.type);
      setAppliedIdentification(
        data.identification_number?.replace(/-/g, "").trim().toUpperCase() ??
          "",
      );
      setPageNumber(1);
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    reset({
      identification_number: "",
      type: "all",
    });
    setAppliedType("all");
    setAppliedIdentification("");
    setPageNumber(1);
  }, [reset]);

  const handleViewDetail = useCallback((deduction: DeductionDto) => {
    setSelectedDeduction(deduction);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedDeduction(null);
  }, []);

  const handleDetailActionSuccess = useCallback(
    (message: string, closeModal?: boolean) => {
      handleRequestSuccess(message);
      if (closeModal) {
        handleCloseDetail();
      }
    },
    [handleRequestSuccess, handleCloseDetail],
  );

  const handleDetailActionError = useCallback(
    (message?: string) => {
      handleRequestError(message || "Ocurrió un error al procesar la acción.");
    },
    [handleRequestError],
  );

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {(isLoading || isFetching) && (
          <Loader title="Cargando Deducciones Activas..." />
        )}

        {AlertComponent}

        <div className="flex justify-start">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <h3 className="m-0! p-0!">Deducciones Activas</h3>
              <small className="mt-2 text-gray-500 dark:text-gray-300">
                Aquí puedes observar las deducciones activas
              </small>
            </div>
            <img
              className="h-12 w-auto object-contain sm:h-16 md:h-20"
              src={activeLogo}
              alt="logo alpac"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-t-slate-600 pt-4 dark:border-t-neutral-600">
          <div className="flex flex-col justify-center">
            <h3 className="m-0! p-0!">Filtros</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Filtra por identificación o tipo de deducción
            </small>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="flex flex-col">
            <InputText
              label="Identificación"
              className={deductionInputClassName}
              labelClassName={deductionLabelClassName}
              type="text"
              placeholder="Ingrese la identificación"
              errorVariant="tooltip"
              {...register("identification_number", {
                required: false,
                validate: {
                  validateIdentification: (value?: string) =>
                    !value?.trim() ||
                    validateIdentificationNumber(
                      value,
                      IdentificationEnum.NATIONAL_ID.value,
                    ),
                },
                setValueAs: (value: string) =>
                  value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                onChange: (e) => {
                  e.target.value = formatIdentificationNumber(e.target.value);
                },
              })}
              error={errors.identification_number?.message}
            />
          </div>

          <div className="flex flex-col">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Dropdown
                  label="Tipo de deducción"
                  appearance="dark"
                  placeholder="Todos los tipos"
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(value as DeductionTypeFilterValue)
                  }
                  options={DEDUCTION_TYPE_FILTER_OPTIONS}
                  labelClassName={deductionLabelClassName}
                  valueClassName={deductionLabelClassName}
                  className={deductionDropdownClassName}
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <Button
              type="submit"
              size="giant"
              disabled={!isValid || !isDirty}
              className={deductionPrimaryButtonClassName}
              label="Aplicar filtros"
            />
          </div>

          <div className="flex flex-col">
            <Button
              type="button"
              size="giant"
              className={deductionSecondaryButtonClassName}
              label="Limpiar filtros"
              onClick={handleClearFilters}
            />
          </div>
        </form>

        {listErrorDescription ? (
          <Banner
            variant="error"
            title="Error al cargar las deducciones"
            description={listErrorDescription}
          />
        ) : (
          <div className="flex flex-col">
            <ActiveDeductionTable
              data={datasource}
              isLoading={isLoading}
              onViewDetail={handleViewDetail}
              pagination={
                <Pagination
                  currentPage={deductions?.page_number ?? pageNumber}
                  pageSize={deductions?.page_size ?? PAGE_SIZE}
                  totalRecords={deductions?.total_deductions ?? 0}
                  onPageChange={handlePageChange}
                  disabled={isFetching}
                />
              }
            />
          </div>
        )}

        <ActiveDeductionDetailModal
          isOpen={isDetailOpen && !isChildSupportSelected}
          onClose={handleCloseDetail}
          summary={selectedDeduction}
          detail={detailData}
          isLoading={isDetailLoading}
          isError={isDetailError}
        />

        <ChildSupportDetailModal
          isOpen={isDetailOpen && isChildSupportSelected}
          onClose={handleCloseDetail}
          summary={selectedDeduction}
          detail={detailData}
          isLoading={isDetailLoading}
          isError={isDetailError}
          onActionSuccess={handleDetailActionSuccess}
          onActionError={handleDetailActionError}
        />
      </m.div>
    </LazyMotion>
  );
};
