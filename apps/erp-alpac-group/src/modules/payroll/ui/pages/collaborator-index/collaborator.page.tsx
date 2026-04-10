import {
   Breadcrumb,
   StatsCard,
   DataTable,
   InputText,
   Dropdown,
   Button,
   Badges,
   Pagination,
} from '@alpac/design-system';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
   HospitalIcon,
   TreePalmIcon,
   UserIcon,
   UserRoundPlusIcon,
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import type { CollaboratorRequest } from '@app/modules/payroll/domain/ApiContract/Requests/collaborator.request';
import { useCollaborators } from '@app/modules/payroll/ui/hooks/useCollaborators';
import { useCallback, useState } from 'react';
import { Loader } from '@app/shared/components/loaders/loader';
import type { GetCollaboratorsResponse } from '@app/modules/payroll/domain/ApiContract/Responses/get-collaborators.response';
import { useCatalog } from '@app/modules/catalog/ui/hooks/useCatalog';
import { CatalogEnum } from '@app/core/enums/catalog.enum';
import { CollaboratorStatusBadgeColor, CollaboratorStatusEnum, CollaboratorStatusOptions } from '@app/modules/payroll/domain/enums/collaborator-status.enum';
import { mapCatalogToOptions } from '@app/shared/utils/catalog.utils';
import { formatIdentificationNumber } from '@app/shared/utils/string.utils';
import { AddCollaboratorModal } from '@app/modules/payroll/ui/pages/collaborator-index/components/add-collaborator-modal/add-collaborator-modal';
import { useTheme } from '@alpac/design-system';
import { useCompanyStore } from '@app/shared/stores/useCompanyStore';

export const CollaboratorPage = function () {

   const maxPageSize = 10;

   const [filters, setFilters] = useState<CollaboratorRequest>({
      identification_number: '',
      branch_id: 0,
      area_id: 0,
      page_number: 1,
      page_size: maxPageSize,
      status: '',
   } as CollaboratorRequest);

   const [showAddCollaboratorModal, setShowAddCollaboratorModal] =
      useState(false);

   const navigate = useNavigate();
   const location = useLocation();

   const { theme } = useTheme();
   const { companyId, moduleCode } = useUserStore();
   const { urlImage, neutralUrlImage } = useCompanyStore();

   const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;
   const isProfileView = location.pathname.includes('collaborator-profile');

   const { register, handleSubmit, control, reset } =
      useForm<CollaboratorRequest>();

   const { GetCatalogListQuery: workAreasQuery } = useCatalog({
      company_id: companyId,
      catalog_type_id: CatalogEnum.WORK_AREAS,
   });

   const { GetCatalogListQuery: jobPositionQuery } = useCatalog({
      company_id: companyId,
      catalog_type_id: CatalogEnum.JOB_POSITIONS,
   });

   const { GetCatalogListQuery: branchesQuery } = useCatalog({
      company_id: companyId,
      catalog_type_id: CatalogEnum.BRANCHES,
   });

   const { GetCatalogListQuery: banksQuery } = useCatalog({
      company_id: companyId,
      catalog_type_id: CatalogEnum.BANKS,
   });

   const { GetCollaboratorsQuery } = useCollaborators({
      Collaboratorsfilters: {
         ...filters,
         company_id: companyId,
         module_code: moduleCode,
      },
   });

   const { data: workAreas = [] } = workAreasQuery;
   const { data: jobPositions = [] } = jobPositionQuery;
   const { data: branches = [] } = branchesQuery;
   const { data: banks = [] } = banksQuery;

   const {
      data: collaborators = {
         data: [],
         page_number: 0,
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
   const optionsBranches = mapCatalogToOptions(branches);
   const optionsBanks = mapCatalogToOptions(banks);

   const onSubmit: SubmitHandler<CollaboratorRequest> = async (data) => {
      setFilters((prev) => ({ ...prev, ...data, page_number: 1 }));
   };

   const handlePageChange = useCallback((page: number) => {
      setFilters((prev) => ({ ...prev, page_number: page }));
   }, []);

   const columnConfig = [
      { key: 'collaborator_code', label: 'Código' },
      { key: 'full_name', label: 'Nombre Completo' },
      {
         key: 'identification_number',
         label: 'Identificación',
         render: (value: GetCollaboratorsResponse) => {
            if (!value.identification_number) return '—'
            if (value.identification_number.length !== 14) return value.identification_number
            return formatIdentificationNumber(value.identification_number)
         },
      },
      { key: 'branch_name', label: 'Sucursal' },
      { key: 'work_area', label: 'Área' },
      { key: 'work_position', label: 'Posición' },
      { key: 'vacations', label: 'Vacaciones' },
      {
         key: 'status', label: 'Estado', render: (value: GetCollaboratorsResponse) => (
            !value.status || !CollaboratorStatusEnum[value.status] ? '—' : (
               <Badges
                  label={CollaboratorStatusEnum[value.status].label}
                  color={
                     CollaboratorStatusBadgeColor[value.status] ??
                     'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }
               />
            )
         )
      },
      {
         key: 'actions',
         label: 'Acciones',
         render: (value: GetCollaboratorsResponse) => (
            <Button
               label="Ver Perfil"
               size="small"
               className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
               onClick={() => {
                  navigate('collaborator-profile', {
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
         identification_number: '',
         branch_id: 0,
         area_id: 0,
         page_number: 1,
         page_size: maxPageSize,
         status: '',
      } as CollaboratorRequest);
   }, [reset]);

   const handleAddCollaborator = useCallback(() => {
      setShowAddCollaboratorModal(true);
   }, []);

   return (
      <>
         {isProfileView ? (
            <AnimatePresence mode="wait">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
               >
                  <Outlet />
               </motion.div>
            </AnimatePresence>
         ) :
            (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-4">

                  {GetCollaboratorsQuery.isPending && (
                     <Loader title={'Cargando Colaboradores...'} />
                  )}

                  <div className="flex justify-start">
                     <Breadcrumb
                        items={[
                           { label: 'Dashboard', url: '/', onClick: (url) => navigate(url) },
                           {
                              label: 'Colaboradores',
                              url: '/payroll/collaborators',
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
                           src={activeLogo}
                           alt="logo alpac"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <StatsCard
                        title="Activos"
                        value={
                           collaborators.total_active
                              ? collaborators.total_active.toString()
                              : '0'
                        }
                        icon={<UserIcon size={30} />}
                        borderColor="border-yellow-600! dark:border-yellow-500!"
                     />
                     <StatsCard
                        title="Vacaciones"
                        value={
                           collaborators.total_on_vacation
                              ? collaborators.total_on_vacation.toString()
                              : '0'
                        }
                        icon={<TreePalmIcon size={30} />}
                        borderColor="border-blue-600! dark:border-blue-400!"
                     />
                     <StatsCard
                        title="Subsidios"
                        value={
                           collaborators.total_on_subsidy
                              ? collaborators.total_on_subsidy.toString()
                              : '0'
                        }
                        icon={<HospitalIcon size={30} />}
                        borderColor="border-red-800! dark:border-red-400!"
                     />
                     <StatsCard
                        title="Total"
                        value={
                           collaborators.total_collaborators
                              ? collaborators.total_collaborators.toString()
                              : '0'
                        }
                        icon={<UserRoundPlusIcon size={30} />}
                        borderColor="border-green-800! dark:border-green-600!"
                     />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
                     <div className="flex flex-col justify-center">
                        <h3 className="p-0! m-0!">Accesos Directos</h3>
                        <small className="text-gray-500 dark:text-gray-300">
                           Descripcion de accesos directos
                        </small>
                     </div>
                  </div>

                  <div className="flex justify-between items-center dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button
                           size="giant"
                           label="Agregar Colaborador"
                           icon={<UserRoundPlusIcon size={20} />}
                           className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                           onClick={handleAddCollaborator}
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
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
                           {...register('identification_number',
                              {
                                 setValueAs: (value: string) =>
                                    value ? value.toString().replace(/-/g, "").toUpperCase()
                                       : "",
                                 required: false,
                                 onChange: (e) => {
                                    e.target.value = formatIdentificationNumber(e.target.value)
                                    register("identification_number").onChange(e);
                                 }
                              })}
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
                                    options={optionsWorkAreas ?? []}
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
                                 label="Sucursal"
                                 placeholder="Seleccione una sucursal"
                                 labelClassName="text-black! dark:text-white!"
                                 valueClassName="text-black! dark:text-white!"
                                 className="w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!"
                                 options={optionsBranches ?? []}
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
                                 options={CollaboratorStatusOptions ?? []}
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

                  <div className="flex flex-col">
                     <DataTable
                        title="Lista de colaboradores"
                        data={collaborators.data ?? []}
                        columns={columnConfig}
                        pagination={
                           <Pagination
                              currentPage={collaborators.page_number}
                              pageSize={collaborators.page_size}
                              totalRecords={collaborators.total_records}
                              onPageChange={handlePageChange}
                              disabled={GetCollaboratorsQuery.isPending}
                           />
                        }
                     />
                  </div>
                  <AddCollaboratorModal
                     isOpen={showAddCollaboratorModal}
                     optionsWorkAreas={optionsWorkAreas}
                     optionsJobPositions={optionsJobPositions}
                     optionsBranches={optionsBranches}
                     optionsBanks={optionsBanks}
                     onClose={() => setShowAddCollaboratorModal(false)}
                  />

               </motion.div>
            )
         }
      </>
   );
};
