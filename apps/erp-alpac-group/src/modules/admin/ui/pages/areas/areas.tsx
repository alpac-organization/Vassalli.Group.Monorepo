import {
  Breadcrumb,
  Button,
  InputText,
  Modal,
  Pagination,
} from "@alpac/design-system";
import { AreaTable } from "@app/modules/admin/ui/pages/areas/components/areas-table/area-table";
import { areaColumns } from "@app/modules/admin/ui/pages/areas/components/areas-table/utils/area-columns";
import { useAreas } from "@app/modules/admin/ui/hooks/areas/useAreas";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { GetAreasResponse } from "@app/modules/admin/domain/ApiContract/responses/areas/get-areas.response";
import { m, LazyMotion } from "framer-motion";
import { AlertTriangle, PlusCircle, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const loadFeatures = () =>
  import("framer-motion").then((res) => res.domAnimation);

const PAGE_SIZE = 10;

export function AreasPage() {
  const navigate = useNavigate();
  const { companyId } = useUserStore();

  const [pageNumber, setPageNumber] = useState(1);
  const [isPaging, setIsPaging] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<GetAreasResponse | null>(
    null,
  );
  const { GetAreasByCompany, CreateArea, deleteArea } = useAreas({
    company_id: companyId ?? "",
  });

  const areas = GetAreasByCompany.data ?? [];

  const paginatedData = useMemo(
    () => areas.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE),
    [areas, pageNumber],
  );

  const isTableLoading =
    isPaging || (GetAreasByCompany.isFetching && !GetAreasByCompany.isPending);

  const handlePageChange = useCallback((page: number) => {
    setIsPaging(true);
    setPageNumber(page);
  }, []);

  useEffect(() => {
    if (!isPaging) {
      return;
    }
    const timer = window.setTimeout(() => setIsPaging(false), 350);
    return () => window.clearTimeout(timer);
  }, [pageNumber, isPaging]);

  const handleOpenCreate = useCallback(() => {
    setCreateName("");
    setCreateDescription("");
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const canSubmitCreate =
    Boolean(companyId && createName.trim()) && !CreateArea.isPending;

  const handleConfirmCreate = useCallback(() => {
    if (!companyId || !createName.trim()) {
      return;
    }
    const trimmedDescription = createDescription.trim();
    CreateArea.mutate(
      {
        company_id: companyId,
        work_area_name: createName.trim(),
        description: trimmedDescription || null,
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

  const handleConfirmDelete = useCallback(() => {
    if (!companyId || !areaToDelete) {
      return;
    }
    deleteArea.mutate(
      {
        company_id: companyId,
        area_id: areaToDelete.work_area_id,
      },
      {
        onSuccess: () => {
          handleCloseDeleteModal();
          setPageNumber(1);
        },
      },
    );
  }, [companyId, areaToDelete, deleteArea, handleCloseDeleteModal]);

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
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmitCreate) {
              return;
            }
            handleConfirmCreate();
          }}
        >
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
            placeholder="Ingrese una descripción (opcional)"
            value={createDescription}
            onChange={(e) => setCreateDescription(e.target.value)}
            labelClassName="text-black! dark:text-white!"
            className="rounded-md! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!"
          />
          <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
            <Button
              type="submit"
              size="giant"
              label="Guardar"
              isLoading={CreateArea.isPending}
              disabled={!canSubmitCreate}
              className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:flex-1 sm:min-w-0 enabled:opacity-100! disabled:pointer-events-none disabled:opacity-50 disabled:saturate-75"
            />
            <Button
              type="button"
              size="giant"
              label="Cancelar"
              onClick={handleCloseCreate}
              disabled={CreateArea.isPending}
              className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
            />
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        variant="default"
        size="sm"
        title="Eliminar área de trabajo"
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
        <form
          className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-stretch"
          onSubmit={(e) => {
            e.preventDefault();
            if (deleteArea.isPending) {
              return;
            }
            handleConfirmDelete();
          }}
        >
          <Button
            type="submit"
            size="giant"
            label="Confirmar"
            isLoading={deleteArea.isPending}
            disabled={deleteArea.isPending}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
          <Button
            type="button"
            size="giant"
            label="Cancelar"
            onClick={handleCloseDeleteModal}
            disabled={deleteArea.isPending}
            className="w-full! min-h-[48px]! shrink-0 text-[15px]! leading-snug! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! sm:flex-1 sm:min-w-0"
          />
        </form>
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
          className="flex w-full min-w-0 flex-col gap-4"
        >
          <div className="min-w-0 overflow-x-auto">
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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="p-0! m-0! text-xl sm:text-2xl">
                Áreas de Trabajo
              </h3>
              <small className="text-sm text-gray-500 dark:text-gray-300">
                Gestione y organice las unidades operativas de la empresa
              </small>
            </div>
            <Button
              size="giant"
              label="Nueva Área de Trabajo"
              icon={<PlusCircle size={18} />}
              onClick={handleOpenCreate}
              className="w-full! shrink-0 text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! sm:w-auto!"
            />
          </div>

          <AreaTable
            data={paginatedData}
            columns={areaColumns}
            deleteIcon={<Trash size={18} />}
            onDeleteClick={handleDeleteClick}
            isLoading={isTableLoading}
            pagination={
              <Pagination
                currentPage={pageNumber}
                pageSize={PAGE_SIZE}
                totalRecords={areas.length}
                onPageChange={handlePageChange}
                disabled={isTableLoading}
              />
            }
          />
        </m.div>
      )}
    </LazyMotion>
  );
}
