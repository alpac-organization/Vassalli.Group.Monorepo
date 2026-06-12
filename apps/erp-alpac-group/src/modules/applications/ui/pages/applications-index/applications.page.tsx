import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Breadcrumb,
  Button,
  Dropdown,
  InputText,
  Pagination,
} from "@alpac/design-system";
import { m, LazyMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useTheme } from "@alpac/design-system";
import { useApplications } from "@app/modules/applications/ui/hooks/useApplications";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { ApplicationsTable } from "./components/application-table/applications-table";
import { Loader } from "@app/shared/components/loaders/loader";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PermitApplicationTypeOptions } from "@app/modules/applications/domain/enums/permit-application-type.enum";
import { PermitApplicationStatusOptions } from "@app/modules/applications/domain/enums/permit-application-status.enum";
import { ApplicationModal } from "./components/application-modal/application-modal";
import { RoleEnum } from "@app/core/enums/role.enum";
import {
  formatCollaboratorCode,
  validateCollaboratorCode,
} from "@app/shared/utils/collaborator.utils";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { ManagerForm } from "./components/application-forms/manager-form/manager-form";
// import { Plus } from "lucide-react";

import type { ApplicationRequest } from "@app/modules/applications/domain/ApiContract/Requests/application.request";
import type { GetApplicationsResponse } from "@app/modules/applications/domain/ApiContract/Responses/get-application.response";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

//import { NewPermissionRequestModal } from "@app/modules/payroll/ui/pages/permissions/components/new-permission-request/new-permission-modal";

export const ApplicationsPage = function () {
  const maxPageSize = 5;

  const initialFilters: ApplicationRequest = {
    companie_id: "",
    module_code: "",
    page_size: maxPageSize,
    page_number: 1,
  };

  const navigate = useNavigate();

  const [filters, setFilters] = useState<ApplicationRequest>(initialFilters);
  // const [isNewPermissionRequestModalOpen, setIsNewPermissionRequestModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const { theme } = useTheme();
  const { role } = useUserStore();
  const { urlImage, neutralUrlImage } = useCompanyStore();
  const { companyId, moduleCode } = useUserStore();
  const { getMappedError } = useMappedError();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationRequest>({
    defaultValues: initialFilters,
    shouldUnregister: false,
  });

  const isManager = role === RoleEnum.MANAGER;
  const isAdministrator = role === RoleEnum.ADMINISTRATOR;
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;
  const isListEnabled: boolean = isAdministrator;
  //   const isDetailEnabled: boolean = isManager && !!filters.collaborator_code;
  const isDetailEnabled: boolean = isManager && !!filters.identification_number;

  const { GetApplicationsQuery, GetApplicationDetailQuery } = useApplications(
    {
      ...filters,
      companie_id: companyId,
      module_code: moduleCode,
    },
    {
      enabled: isListEnabled,
      enabledDetail: isDetailEnabled,
    },
  );

  const applicationsData = useMemo(
    () =>
      isAdministrator
        ? (GetApplicationsQuery.data?.data ?? [])
        : GetApplicationDetailQuery.data
          ? [GetApplicationDetailQuery.data]
          : [],
    [
      isAdministrator,
      GetApplicationsQuery.data,
      GetApplicationDetailQuery.data,
    ],
  );
  const isLoading =
    GetApplicationsQuery.isLoading || GetApplicationDetailQuery.isLoading;

  const isFetching =
    GetApplicationsQuery.isFetching || GetApplicationDetailQuery.isFetching;

  const isSuccess =
    GetApplicationsQuery.isSuccess || GetApplicationDetailQuery.isSuccess;

  const isError =
    GetApplicationsQuery.isError || GetApplicationDetailQuery.isError;

  const queryErrors =
    GetApplicationsQuery.error || GetApplicationDetailQuery.error;

  useEffect(() => {
    if (isFetching) return;

    if (isError && queryErrors) {
      const mappedError = getMappedError(queryErrors);
      setShowAlert({
        show: true,
        type: "error",
        title: "Error al cargar",
        message: mappedError.description || "Error al cargar las solicitudes",
      });
    }

    if (
      applicationsData.length === 0 &&
      isSuccess &&
      isManager &&
      // !!filters.collaborator_code
      !!filters.identification_number
    ) {
      setShowAlert({
        show: true,
        type: "error",
        title: "Error",
        message: "No se encontraron solicitudes",
      });
    }

    handleCloseAlert();
  }, [applicationsData, isFetching, isSuccess, isError, queryErrors]);

  const handleCloseAlert = useCallback(() => {
    setTimeout(() => {
      setShowAlert({ show: false, type: "info", title: "", message: "" });
    }, 3000);
  }, []);

  const onSubmit: SubmitHandler<ApplicationRequest> = async (data) => {
    setFilters((prev) => ({ ...prev, ...data }));
  };

  const handleClearFilters = useCallback(() => {
    reset(initialFilters);
    setFilters(initialFilters);
    setShowAlert({
      show: false,
      type: "info",
      title: "",
      message: "",
    });
  }, [reset]);

  /*    const handleRequestError = useCallback((description: string) => {
         setShowAlert({
            show: true,
            type: "error",
            title: "Error",
            message: description,
         });
         handleCloseAlert();
      }, []);
   
      const handleRequestSuccess = useCallback(() => {
         setShowAlert({
            show: true,
            type: "success",
            title: "Éxito",
            message: "Solicitud creada exitosamente",
         });
         handleCloseAlert();
      }, []); */

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page_number: page }));
  }, []);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<GetApplicationsResponse>({} as GetApplicationsResponse);

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        {isFetching && (
          <Loader
            title={
              isAdministrator
                ? "Cargando Solicitudes..."
                : "Cargando Solicitud..."
            }
          />
        )}

        <div className="flex justify-start">
          <Breadcrumb
            items={[
              { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
              {
                label: "Solicitudes",
                url: "/applications",
                onClick: (url) => navigate(url),
              },
            ]}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
              <h3 className="p-0! m-0!">
                {isManager ? "Búsqueda de Solicitudes" : "Lista de Solicitudes"}
              </h3>
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
              {isManager
                ? "Filtre las solicitudes por identificación de colaborador."
                : "Filtre las solicitudes por tipo o estado para encontrar información específica."}
            </small>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
        >
          {isManager && (
            <div className="flex flex-col">
              <InputText
                label="Identificación de Colaborador"
                className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
                labelClassName="text-black! dark:text-white!"
                type="text"
                placeholder="Ingrese la identificación del colaborador"
                errorVariant="tooltip"
                {...register("identification_number", {
                  required: "la identificación del colaborador es requerido",
                  validate: {
                    validateCode: (value?: string) =>
                      validateCollaboratorCode(value!),
                  },
                  onChange: (evt) => {
                    evt.target.value = formatCollaboratorCode(evt.target.value);
                  },
                })}
                error={errors.identification_number?.message}
              />
            </div>
          )}

          {isAdministrator && (
            <div className="flex flex-col">
              <Controller
                name="type"
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field }) => {
                  return (
                    <Dropdown
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Tipo de Solicitud"
                      appearance="dark"
                      placeholder="Seleccione un tipo de solicitud"
                      labelClassName="text-black! dark:text-white!"
                      valueClassName="text-black! dark:text-white!"
                      className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                      options={PermitApplicationTypeOptions ?? []}
                    />
                  );
                }}
              />
            </div>
          )}

          {isAdministrator && (
            <div className="flex flex-col">
              <Controller
                name="status"
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field }) => {
                  return (
                    <Dropdown
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Estado de Solicitud"
                      placeholder="Seleccione un estado de solicitud"
                      appearance="dark"
                      labelClassName="text-black! dark:text-white!"
                      valueClassName="text-black! dark:text-white!"
                      className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                      options={PermitApplicationStatusOptions ?? []}
                    />
                  );
                }}
              />
            </div>
          )}

          <div className="flex flex-col">
            <Button
              type="submit"
              size="giant"
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

        {/*<NewPermissionRequestModal
               payrollId={"Aquí se debe pasar el id de la nómina"}
               isOpen={isNewPermissionRequestModalOpen}
               onClose={() => setIsNewPermissionRequestModalOpen(false)}
               onRequestError={handleRequestError}
               onRequestSuccess={handleRequestSuccess}
            />*/}

        {isManager && applicationsData.length === 0 && !isLoading && (
          <div>
            <p className="h-[100px] rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center text-center text-gray-500 dark:text-gray-300">
              Debe ingresar el código del colaborador para ver las solicitudes
            </p>
          </div>
        )}

        {isManager &&
          applicationsData.length > 0 &&
          applicationsData.map((application) => (
            <div
              key={application.permit_apllication_id}
              className="flex flex-col gap-4"
            >
              <ManagerForm application={application} />
            </div>
          ))}

        <AnimatedAlertWrapper open={showAlert.show}>
          <Alert
            type={showAlert.type}
            title={showAlert.title}
            message={showAlert.message}
          />
        </AnimatedAlertWrapper>

        {isAdministrator && (
          <div className="flex flex-col">
            <ApplicationsTable
              data={applicationsData}
              onOpenApplicationDetailModal={(application) => {
                setSelectedApplication(application);
                setIsApplicationModalOpen(true);
              }}
              pagination={
                <Pagination
                  currentPage={GetApplicationsQuery.data?.page_number ?? 0}
                  pageSize={GetApplicationsQuery.data?.page_size ?? 0}
                  totalRecords={GetApplicationsQuery.data?.total ?? 0}
                  onPageChange={handlePageChange}
                  disabled={GetApplicationsQuery.isFetching}
                />
              }
            />
          </div>
        )}

        {isAdministrator && (
          <ApplicationModal
            application={selectedApplication}
            isOpen={isApplicationModalOpen}
            onClose={() => setIsApplicationModalOpen(false)}
          />
        )}
      </m.div>

      {/* {
            isManager && (
               <Button
                  type="button"
                  size="small"
                  icon={<Plus size={18} />}
                  label=""
                  ariaLabel="Agregar Solicitud"
                  tooltip="Agregar Solicitud"
                  className="fixed! bottom-12! right-6! z-40! isolate! min-h-14! min-w-14! rounded-full! bg-alpac-primary-500! dark:bg-white! text-black! active:scale-100! md:hover:brightness-110! md:hover:shadow-2xl! md:hover:-translate-y-0.5! focus-visible:outline-none! focus-visible:ring-2! focus-visible:ring-alpac-primary-400! focus-visible:ring-offset-2! dark:focus-visible:ring-offset-[#0f172a]!"
                  onClick={() => setIsNewPermissionRequestModalOpen(true)}
               />
            )
         } */}
    </LazyMotion>
  );
};
