import {
  Breadcrumb,
  Button,
  Dropdown,
  InputText,
  Pagination,
  useTheme,
  type Option,
} from "@alpac/design-system";

import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m, LazyMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ActiveDeductionTable } from "./components/active-deduction-table/active-deduction-table";
import { useDeduction } from "../../hooks/deduction/useDeduction";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import { DeductionTypeEnum } from "@app/modules/payroll/domain/enums/deduction-enums/deduction-type.enum";
import {
  formatIdentificationNumber,
  validateIdentificationNumber,
} from "@app/shared/utils/string.utils";

import type { GetDeductionsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/deduction-requests/get-deductions.request";
import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";
import { ActiveDeductionDetailModal } from "./components/active-deduction-detail-modal/active-deduction-detail-modal";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 5;

type DeductionTypeFilterValue = "all" | keyof typeof DeductionTypeEnum;

type ActiveDeductionFilterForm = {
  identification_number: string;
  type: DeductionTypeFilterValue;
};

const DEDUCTION_TYPE_FILTER_OPTIONS: Option[] = [
  { label: "Todos los tipos", value: "all" },
  ...Object.entries(DeductionTypeEnum).map(([key, item]) => ({
    label: item.label,
    value: key,
  })),
];

const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

export const ActiveDeductionsPage = () => {
  const navigate = useNavigate();

  const { theme } = useTheme();

  const { urlImage, neutralUrlImage } = useCompanyStore();

  const { companyId, moduleCode } = useUserStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

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
      companie_id: companyId,
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

  const detailFIlters = {
    companie_id: companyId,
    module_code: moduleCode,
    deduction_id: selectedDeduction?.deduction_id ?? "",
    identification_number: selectedDeduction?.identification_number,
  };

  const { data: deductions, isLoading, isFetching } = useGetDeductions(filters);

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetDeductionDetails(detailFIlters, {
    enabled:
      isDetailOpen &&
      !!selectedDeduction?.deduction_id &&
      !!companyId &&
      !!moduleCode,
  });

  const datasource = deductions?.data ?? [];

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
    reset({ identification_number: "", type: "all" });
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

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {isLoading && <Loader title="Cargando Deducciones Activas..." />}

        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
              {
                label: "Deducciones Activas",
                url: "/active-deductions",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
              <h3 className="p-0! m-0!">Deducciones Activas</h3>
              <small className="text-gray-500 dark:text-gray-300 mt-2">
                Aqui puedes observar las deducciones activas
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
              Filtra por identificación o tipo de deducción
            </small>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
        >
          <div className="flex flex-col">
            <InputText
              label="Identificación"
              className={inputClassName}
              labelClassName={labelClassName}
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
          <ActiveDeductionTable
            data={datasource}
            onViewDetail={handleViewDetail}
            pagination={
              <Pagination
                currentPage={deductions?.page_number ?? 0}
                pageSize={deductions?.page_size ?? 0}
                totalRecords={deductions?.total_deductions ?? 0}
                onPageChange={handlePageChange}
                disabled={isFetching}
              />
            }
          />
        </div>

        <ActiveDeductionDetailModal
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          summary={selectedDeduction}
          detail={detailData}
          isLoading={isDetailLoading}
          isError={isDetailError}
        />
      </m.div>
    </LazyMotion>
  );
};
