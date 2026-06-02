import {
  Breadcrumb,
  Button,
  InputText,
  Modal,
  Pagination,
  useTheme,
} from "@alpac/design-system";
import { AreaTable } from "@app/modules/admin/ui/pages/areas/components/areas-table/area-table";
import { areaColumns } from "@app/modules/admin/ui/pages/areas/components/areas-table/area-columns";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import { m, LazyMotion } from "framer-motion";
import { AlertTriangle, PlusCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 10;

export function AreasPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { companyId } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<GetAreasResponse | null>(
    null,
  );

  const { GetAreasByCompany, CreateArea } = useAreas({
    company_id: companyId ?? "",
  });

  const areas = GetAreasByCompany.data ?? [];

  const paginatedData = useMemo(
    () => areas.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE),
    [areas, pageNumber],
  );

  const handleOpenCreate = useCallback(() => {
    setCreateName("");
    setCreateDescription("");
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleConfirmCreate = useCallback(() => {
    if (!companyId || !createName.trim()) {
      return;
    }
    CreateArea.mutate(
      {
        company_id: companyId,
        work_area_name: createName.trim(),
        description: createDescription.trim(),
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setCreateName("");
          setCreateDescription("");
          setPageNumber(1);
        },
      },
    );
  }, [companyId, CreateArea, createName, createDescription]);

  const handleDeleteClick = useCallback((area: GetAreasResponse) => {
    setAreaToDelete(area);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setAreaToDelete(null);
  }, []);

  return (
    <LazyMotion features={loadFeatures} strict>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreate}
        variant="default"
        size="sm"
        title="Nueva Área de Trabajo"
        description="Complete los datos para registrar una nueva área de trabajo."
      >
        <div className="mt-4 flex flex-col gap-4">
          <InputText
            label="Nombre del Área"
            placeholder="Ingrese el nombre del área"
            isRequired
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
          <InputText
            label="Descripción"
            placeholder="Ingrese una descripción"
            isRequired
            value={createDescription}
            onChange={(e) => setCreateDescription(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Guardar"
            onClick={handleConfirmCreate}
            disabled={
              !createName.trim() ||
              !createDescription.trim() ||
              CreateArea.isPending
            }
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseCreate}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        variant="default"
        size="sm"
        title="Eliminar área de trabajo"
        description={
          areaToDelete
            ? `Estás a punto de eliminar el área "${areaToDelete.work_area_name}". Esta acción no se puede deshacer y toda la información asociada se perderá permanentemente.`
            : "Esta acción no se puede deshacer. El área y toda su información asociada se perderán permanentemente."
        }
      >
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-950/30">
          <AlertTriangle
            size={20}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
          />
          <p className="text-sm text-red-700 dark:text-red-300">
            Esta operación es irreversible. Asegúrese de que no existen centros
            de costo ni recursos asignados a esta área antes de eliminarla.
          </p>
        </div>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="giant"
            label="Confirmar eliminación"
            onClick={handleCloseDeleteModal}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-red-600! hover:bg-red-700! dark:bg-red-700! dark:hover:bg-red-800! sm:flex-1 sm:min-w-0"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseDeleteModal}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </div>
      </Modal>

      {GetAreasByCompany.isPending && (
        <Loader title="Cargando áreas de trabajo..." />
      )}

      {!GetAreasByCompany.isPending && (
        <m.div
          key="areas-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-start">
            <Breadcrumb
              items={[
                {
                  label: "Dashboard",
                  url: "/dashboard",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Administración",
                  url: "/administration",
                  onClick: (url) => navigate(url),
                },
                {
                  label: "Áreas de Trabajo",
                  url: "/administration/areas",
                  onClick: (url) => navigate(url),
                },
              ]}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <h3 className="p-0! m-0!">Áreas de Trabajo</h3>
              <small className="text-gray-500 dark:text-gray-300">
                Gestione y organice las unidades operativas de la empresa
              </small>
            </div>
            <Button
              size="giant"
              label="+ Nueva Área de Trabajo"
              //   icon={<PlusCircle size={18} />}
              onClick={handleOpenCreate}
              className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            />
          </div>

          <AreaTable
            data={paginatedData}
            columns={areaColumns}
            onDeleteClick={handleDeleteClick}
            pagination={
              <Pagination
                currentPage={pageNumber}
                pageSize={PAGE_SIZE}
                totalRecords={areas.length}
                onPageChange={setPageNumber}
                disabled={GetAreasByCompany.isFetching}
              />
            }
          />
        </m.div>
      )}
    </LazyMotion>
  );
}
