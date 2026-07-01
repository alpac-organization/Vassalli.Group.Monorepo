import {
   Breadcrumb,
   Button,
   DatePicker,
   InputText,
   Pagination,
   useTheme,
   type DatePickerValue,
} from "@alpac/design-system";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m, LazyMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { AttendanceControlTable } from "./components/attendance-control-table/attendance-control-table";
import { useAttendance } from "../../hooks/attendance/useAttendance";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { IdentificationEnum } from "@app/core/enums/identification.enum";
import {
   formatIdentificationNumber,
   validateIdentificationNumber,
} from "@app/shared/utils/string.utils";
import type { GetAttendanceRecordsRequest } from "@app/modules/payroll/domain/ApiContract/Requests/attendance-requests/get-attendance-records.request";
import { BookIcon } from "lucide-react";

const loadFeatures = () =>
   import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 10;

type AttendanceControlFilterForm = {
   start_date: DatePickerValue | null;
   end_date: DatePickerValue | null;
   identification_number: string;
};

const dropdownClassName =
   "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";

const inputClassName =
   "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";

const labelClassName = "text-black! dark:text-white!";

const toApiDate = (date: DatePickerValue | null): string | null => {
   if (!date) return null;
   return dayjs(date.$d ?? date).format("YYYY-MM-DD");
};

export const AttendanceControlPage = () => {

   const navigate = useNavigate();
   const { theme } = useTheme();
   const { urlImage, neutralUrlImage } = useCompanyStore();
   const { companyId } = useUserStore();
   const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

   const {
      register,
      handleSubmit,
      control,
      reset,
      getValues,
      trigger,
      formState: { errors, isValid, isDirty },
   } = useForm<AttendanceControlFilterForm>({
      mode: "onChange",
      defaultValues: {
         start_date: null,
         end_date: null,
         identification_number: "",
      },
   });

   const { useGetAttendanceRecords } = useAttendance();

   const [pageNumber, setPageNumber] = useState(1);
   const [appliedStartDate, setAppliedStartDate] = useState<string | null>(null);
   const [appliedEndDate, setAppliedEndDate] = useState<string | null>(null);
   const [appliedIdentification, setAppliedIdentification] = useState("");
   const [startDate, setStartDate] = useState<Date | null>(null);

   const hasAppliedPeriod = Boolean(appliedIdentification.trim()) || Boolean(appliedStartDate && appliedEndDate);

   const filters = useMemo<GetAttendanceRecordsRequest>((): GetAttendanceRecordsRequest => {

      return {
         companie_id: companyId,
         start_date: appliedStartDate ?? null,
         end_date: appliedEndDate ?? null,
         page_number: pageNumber,
         page_size: PAGE_SIZE,
         ...(appliedIdentification.trim() && {
            identification_number: appliedIdentification.trim(),
         }),
      };

   }, [
      companyId,
      pageNumber,
      appliedStartDate,
      appliedEndDate,
      appliedIdentification,
   ]);

   const {
      data: attendanceRecords,
      isLoading,
      isFetching,
   } = useGetAttendanceRecords(filters ?? ({} as GetAttendanceRecordsRequest), {
      enabled: true
   });

   const datasource = hasAppliedPeriod ? (attendanceRecords?.data ?? []) : [];

   const handlePageChange = useCallback((page: number) => {
      setPageNumber(page);
   }, []);

   const onSubmit: SubmitHandler<AttendanceControlFilterForm> = useCallback(
      (data) => {
         const identification =
            data.identification_number?.replace(/-/g, "").trim().toUpperCase() ?? "";
         const startDate = toApiDate(data.start_date);
         const endDate = toApiDate(data.end_date);

         const hasIdentification = Boolean(identification);
         const hasDateRange = Boolean(startDate && endDate);

         if (!hasIdentification && !hasDateRange) return;

         setPageNumber(1);
         setAppliedIdentification(hasIdentification ? identification : "");
         setAppliedStartDate(hasDateRange ? startDate : null);
         setAppliedEndDate(hasDateRange ? endDate : null);
      },
      [],
   );

   const handleClearFilters = useCallback(() => {
      reset({
         start_date: null,
         end_date: null,
         identification_number: "",
      });
      setPageNumber(1);
      setAppliedStartDate(null);
      setAppliedEndDate(null);
      setAppliedIdentification("");
   }, [reset]);

   const handleGenerateReport = useCallback(() => {
      
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
            {hasAppliedPeriod && isLoading && (
               <Loader title="Cargando control de asistencia..." />
            )}

            <div className="flex justify-start">
               <Breadcrumb
                  items={[
                     {
                        label: "Dashboard",
                        url: "/",
                        onClick: (url) => navigate(url),
                     },
                     {
                        label: "Control de Asistencia",
                        url: "/payroll/control-asistencia",
                        onClick: (url) => navigate(url),
                     },
                  ]}
               />
            </div>

            <div className="flex flex-col">
               <div className="flex justify-between items-center">
                  <div className="flex flex-col justify-center">
                     <h3 className="p-0! m-0!">Control de Asistencia</h3>
                     <small className="text-gray-500 dark:text-gray-300 mt-2">
                        Consulta las marcaciones de colaboradores registradas en el
                        reloj biométrico
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
                  <h3 className="p-0! m-0!">Accesos Directos</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                     Acciones de la sección de control de asistencia
                  </small>
               </div>
            </div>

            <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
               <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
                  <Button
                     size="giant"
                     label="Generar reporte"
                     icon={<BookIcon size={20} />}
                     className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                     onClick={handleGenerateReport}
                  />
               </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
               <div className="flex flex-col justify-center">
                  <h3 className="p-0! m-0!">Filtros</h3>
                  <small className="text-gray-500 dark:text-gray-300">
                     Ingrese identificación o un rango de fechas para consultar las
                     marcaciones
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
                                 IdentificationEnum.NATIONAL_ID.value ||
                                 IdentificationEnum.RESIDENCE_ID.value,
                              ),
                        },
                        setValueAs: (value: string) =>
                           value ? value.toString().replace(/-/g, "").toUpperCase() : "",
                        onChange: (e) => {
                           e.target.value = formatIdentificationNumber(e.target.value);
                           trigger(["start_date", "end_date"]);
                        },
                     })}
                     error={errors.identification_number?.message}
                  />
               </div>

               <div className="flex flex-col">
                  <Controller
                     name="start_date"
                     control={control}
                     rules={{
                        validate: (value) => {
                           const identification = getValues("identification_number")?.trim();
                           const endDate = getValues("end_date");

                           if (identification) return true;
                           if (!value && !endDate) {
                              return "Ingrese identificación o un rango de fechas.";
                           }
                           if (!value && endDate) {
                              return "La fecha de inicio es requerida.";
                           }
                           return true;
                        },
                     }}
                     render={({ field }) => (
                        <DatePicker
                           fieldWidth="large"
                           label="Fecha inicio"
                           className={dropdownClassName}
                           labelClassName={labelClassName}
                           value={field.value}
                           labelAbove
                           errorVariant="tooltip"
                           onChange={(value) => {
                              field.onChange(value);
                              setStartDate(value.$d);
                              trigger(["end_date", "identification_number"]);
                           }}
                           error={errors.start_date?.message as string}
                        />
                     )}
                  />
               </div>

               <div className="flex flex-col">
                  <Controller
                     name="end_date"
                     control={control}
                     rules={{
                        validate: (value) => {
                           const identification = getValues("identification_number")?.trim();
                           const startDate = getValues("start_date");

                           if (identification) return true;
                           if (!value && !startDate) {
                              return "Ingrese identificación o un rango de fechas.";
                           }
                           if (!value && startDate) {
                              return "La fecha de fin es requerida.";
                           }
                           if (
                              value &&
                              startDate &&
                              dayjs(value.$d ?? value).isBefore(
                                 dayjs(startDate.$d ?? startDate),
                                 "day",
                              )
                           ) {
                              return "La fecha de fin no puede ser menor a la fecha de inicio.";
                           }
                           return true;
                        },
                     }}
                     render={({ field }) => (
                        <DatePicker
                           fieldWidth="large"
                           label="Fecha fin"
                           className={dropdownClassName}
                           labelClassName={labelClassName}
                           value={field.value}
                           labelAbove
                           errorVariant="tooltip"
                           referenceDate={startDate ? dayjs(startDate) : undefined}
                           onChange={(value) => {
                              field.onChange(value);
                              trigger(["start_date", "identification_number"]);
                           }}
                           error={errors.end_date?.message as string}
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

               <AttendanceControlTable
                  data={datasource}
                  pagination={
                     hasAppliedPeriod ? (
                        <Pagination
                           currentPage={attendanceRecords?.page_number ?? 0}
                           pageSize={attendanceRecords?.page_size ?? 0}
                           totalRecords={attendanceRecords?.total ?? 0}
                           onPageChange={handlePageChange}
                           disabled={isFetching}
                        />
                     ) : undefined
                  }
               />

            </div>
         </m.div>
      </LazyMotion>
   );
};
