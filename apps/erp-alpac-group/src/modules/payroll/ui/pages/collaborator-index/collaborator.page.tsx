import {
  Breadcrumb,
  StatsCard,
  DataTable,
  InputText,
  Dropdown,
  Button,
} from "@alpac/design-system";
import { useImage } from "@app/shared/hooks/useImage";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { motion } from "framer-motion";
import {
  HospitalIcon,
  TreePalmIcon,
  UserIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import type { CollaboratorRequest } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator.request";
import { useCollaborators } from "@app/modules/payroll/ui/hooks/useCollaborators";
import { useCallback, useState } from "react";
import { Loader } from "@app/shared/components/loaders/loader";
import type { GetCollaboratorsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborators.response";
import { useCatalog } from "@app/modules/catalog/ui/hooks/useCatalog";
import {
  CatalogEnum,
  CollaboratorStatusEnum,
} from "@app/core/enums/catalog.enum";
import { mapCatalogToOptions } from "@app/shared/utils/catalog.utils";

export const CollaboratorPage = function () {
  const [filters, setFilters] = useState<CollaboratorRequest>({
    identification_number: "",
    branch_id: 0,
    area_id: 0,
    page_number: 1,
    page_size: 10,
    status: "",
  } as CollaboratorRequest);

  const navigate = useNavigate();

  const { companyId, moduleCode, companyAlias } = useUserStore();

  const companyAliasWhite = companyAlias.toLowerCase().concat(".white");

  const { urlImage } = useImage(companyAliasWhite);

  const { register, handleSubmit, control, reset } =
    useForm<CollaboratorRequest>();

  const { GetCatalogListQuery: workAreasQuery } = useCatalog({
    company_id: companyId,
    catalog_type: CatalogEnum.WORK_AREAS,
  });

  const { GetCatalogListQuery: jobPositionsQuery } = useCatalog({
    company_id: companyId,
    catalog_type: CatalogEnum.JOB_POSITIONS,
  });

  const { GetCollaboratorsQuery } = useCollaborators({
    ...filters,
    company_id: companyId,
    module_code: moduleCode,
  });

  const { data: workAreas = [] } = workAreasQuery;
  const { data: jobPositions = [] } = jobPositionsQuery;
  const {
    data: collaborators = {
      data: [],
      total_records: 0,
      page_size: 0,
      total_active: 0,
      total_on_vacation: 0,
      total_on_subsidy: 0,
      total_collaborators: 0,
    },
  } = GetCollaboratorsQuery;

  const optionsWorkAreas = mapCatalogToOptions(workAreas);
  const optionsJobPositions = mapCatalogToOptions(jobPositions);
  const optionsStatus = Object.values(CollaboratorStatusEnum).map((value) => ({
    label: value,
    value,
  }));

  const onSubmit: SubmitHandler<CollaboratorRequest> = async (data) => {
    setFilters((prev) => ({ ...prev, ...data }));
  };

  const columnConfig = [
    { key: "collaborator_code", label: "Código" },
    { key: "full_name", label: "Nombre Completo" },
    { key: "identification_number", label: "Identificación" },
    { key: "branch_name", label: "Sucursal" },
    { key: "work_area", label: "Área" },
    { key: "work_position", label: "Posición" },
    { key: "status", label: "Estado" },
    {
      key: "actions",
      label: "Acciones",
      render: (value: GetCollaboratorsResponse) => (
        <Button
          label="Ver Perfil"
          size="small"
          className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
          onClick={() => {
            navigate("/payroll/collaborator-profile", {
              state: {
                identification_number: value.identification_number,
              },
            });
          }}
        />
      ),
    },
  ];

  const handleClearFilters = useCallback(() => {
    reset();
    setFilters({
      identification_number: "",
      branch_id: 0,
      area_id: 0,
      page_number: 1,
      page_size: 10,
      status: "",
    } as CollaboratorRequest);
  }, [reset]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      {GetCollaboratorsQuery.isPending && (
        <Loader title={"Cargando Colaboradores..."} />
      )}

      <div className="flex justify-start">
        <Breadcrumb
          items={[
            { label: "Dashboard", url: "/", onClick: (url) => navigate(url) },
            {
              label: "Colaboradores",
              url: "/payroll/collaborators",
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Colaboradores</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Descripcion de colaboradores y sus estadisticas
            </small>
          </div>
          <img
            className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            src={urlImage}
            alt="logo alpac"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Activos"
          value={collaborators.total_active.toString()}
          trend="Incremento del 10%"
          trendType="up"
          icon={<UserIcon size={30} />}
          borderColor="border-yellow-600! dark:border-yellow-500!"
        />
        <StatsCard
          title="Vacaciones"
          value={collaborators.total_on_vacation.toString()}
          trend="Decremento del 10%"
          trendType="down"
          icon={<TreePalmIcon size={30} />}
          borderColor="border-blue-600! dark:border-blue-400!"
        />
        <StatsCard
          title="Subsidios"
          value={collaborators.total_on_subsidy.toString()}
          trend="Incremento del 10%"
          trendType="up"
          icon={<HospitalIcon size={30} />}
          borderColor="border-red-800! dark:border-red-400!"
        />
        <StatsCard
          title="Total"
          value={collaborators.total_collaborators.toString()}
          trend="Decremento del 10%"
          trendType="down"
          icon={<UserRoundPlusIcon size={30} />}
          borderColor="border-green-800! dark:border-green-600!"
        />
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Filtros</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Descripcion de filtros
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
              className="w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
              labelClassName="text-black! dark:text-white!"
              type="text"
              placeholder="Ingrese la identificación"
              {...register("identification_number", { required: false })}
            />
          </div>

          <div className="flex flex-col">
            <Controller
              name="area_id"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => {
                return (
                  <Dropdown
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Área de trabajo"
                    placeholder="Seleccione un área de trabajo"
                    labelClassName="text-black! dark:text-white!"
                    valueClassName="text-black! dark:text-white!"
                    className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                    options={optionsWorkAreas}
                  />
                );
              }}
            />
          </div>

          <div className="flex flex-col">
            <Controller
              name="branch_id"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <Dropdown
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                  label="Posición de trabajo"
                  placeholder="Seleccione una posición de trabajo"
                  labelClassName="text-black! dark:text-white!"
                  valueClassName="text-black! dark:text-white!"
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  options={optionsJobPositions}
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <Controller
              name="status"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <Dropdown
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Estado"
                  placeholder="Seleccione un estado"
                  labelClassName="text-black! dark:text-white!"
                  valueClassName="text-black! dark:text-white!"
                  className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                  options={optionsStatus}
                />
              )}
            />
          </div>

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
      </div>

      <div className="flex flex-col">
        <DataTable
          title="Lista de colaboradores"
          data={collaborators.data ?? []}
          columns={columnConfig}
        />
      </div>
    </motion.div>
  );
};
