import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  AnimatedAlertWrapper,
  Breadcrumb,
  Button,
  ContextMenu,
  DataTable,
  Dropdown,
  InputText,
  Pagination,
  useTheme,
  type TableColumn,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { m } from "framer-motion";
import { FileTextIcon, PackagePlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { pdf } from "@react-pdf/renderer";
import { RequisitionModal } from "./components/requisition-modal/requisition-modal";
import type { RequisitionRow } from "./components/requisition-modal/requisition-modal.types";
import { RequisitionDocument } from "@app/modules/purchasing/ui/pages/requsition/templates/requisition";
import { RequestMaterialesDocument } from "@app/modules/purchasing/ui/pages/materiales/request.materiales.document";
import { MOCK_MATERIAL_REQUEST } from "@app/modules/purchasing/ui/pages/materiales/mock/mock-request-materiales";
import { RequisitionGenerateReportsModal } from "./components/generate-reports-modal/generate-reports-modal";
import type { RequisitionReportAction } from "./components/generate-reports-modal/generate-reports-modal.types";

const inputClassName =
  "w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
  "w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

const statusOptions = [
  { label: "Borrador", value: "draft" },
  { label: "Pendiente", value: "pending" },
  { label: "Aprobada", value: "approved" },
  { label: "Rechazada", value: "rejected" },
  { label: "Cancelada", value: "cancelled" },
];

const reportOptions: { label: string; value: RequisitionReportAction }[] = [
  { label: "Requisición de compras", value: "requisition" },
  { label: "Solicitud Eventual", value: "Eventual" },
  { label: "Solicitud Mensual", value: "Mensual" },
];

export const Requisition = () => {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);
  const [requisitionNumber, setRequisitionNumber] = useState("");
  const [requesterName, setRequesterName] = useState("");
  const [status, setStatus] = useState<string>("");
  const [selectedRequisition, setSelectedRequisition] =
    useState<RequisitionRow | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedReportAction, setSelectedReportAction] =
    useState<RequisitionReportAction | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const {
    alertState,
    handleCloseAlert,
    handleRequestError,
    handleRequestSuccess,
  } = useAlertState();

  const requisitions: RequisitionRow[] = [];
  const totalRecords = 0;
  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const appearance = useMemo(
    () => (theme === "dark" ? "dark" : "default") as "dark" | "default",
    [theme],
  );

  const handleClearFilters = () => {
    setRequisitionNumber("");
    setRequesterName("");
    setStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleOpenGenerateModal = useCallback(() => {
    setSelectedReportAction(null);
    setIsGenerateModalOpen(true);
  }, []);

  const handleCloseGenerateModal = useCallback(() => {
    if (isGeneratingPdf) return;
    setIsGenerateModalOpen(false);
  }, [isGeneratingPdf]);

  const handleConfirmGenerate = useCallback(async () => {
    if (!selectedReportAction) return;

    try {
      setIsGeneratingPdf(true);

      const document =
        selectedReportAction === "requisition" ? (
          <RequisitionDocument />
        ) : (
          <RequestMaterialesDocument
            data={{ ...MOCK_MATERIAL_REQUEST, period: selectedReportAction }}
            period={selectedReportAction}
          />
        );

      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setIsGenerateModalOpen(false);
    } catch {
      handleRequestError("Ocurrió un error al generar el informe en PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [selectedReportAction, handleRequestError]);

  const onEditRequisition = (data: RequisitionRow) => {
    setSelectedRequisition(data);
    setIsRequisitionModalOpen(true);
  };

  const onViewDetails = (data: RequisitionRow) => {
    console.log(data);
  };

  const columnConfig: TableColumn<RequisitionRow>[] = useMemo(
    () => [
      { key: "requisition_number", label: "N° Requisición" },
      { key: "requester_name", label: "Solicitante" },
      { key: "area_name", label: "Área" },
      { key: "required_date", label: "Fecha límite" },
      { key: "status", label: "Estado" },
      {
        key: "actions",
        label: "Acciones",
        render: (row: RequisitionRow) => (
          <ContextMenu
            items={[
              { label: "Editar", onClick: () => onEditRequisition(row) },
              { label: "Ver detalle", onClick: () => onViewDetails(row) },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
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
              label: "Requisiciones",
              url: `${baseUrl}/purchasing/requisitions`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <h3 className="p-0! m-0!">Requisiciones</h3>
            <small className="text-gray-500 dark:text-gray-300">
              Gestión de Requisiciones
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
            Acciones rápidas de requisiciones
          </small>
        </div>
      </div>

      <div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
        <div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
          <Button
            type="button"
            size="giant"
            label="Agregar Requisición"
            icon={<PackagePlusIcon size={20} />}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={() => {
              setSelectedRequisition(null);
              setIsRequisitionModalOpen(true);
            }}
          />
          <Button
            type="button"
            size="giant"
            label="Generar informes"
            icon={<FileTextIcon size={20} />}
            isLoading={isGeneratingPdf}
            className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
            onClick={handleOpenGenerateModal}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
        <div className="flex flex-col justify-center">
          <h3 className="p-0! m-0!">Filtros</h3>
          <small className="text-gray-500 dark:text-gray-300">
            Filtre la lista de requisiciones
          </small>
        </div>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
      >
        <InputText
          label="N° Requisición"
          placeholder="Ej. REQ-2026-001"
          className={inputClassName}
          labelClassName={labelClassName}
          value={requisitionNumber}
          onChange={(event) => setRequisitionNumber(event.target.value)}
        />

        <InputText
          label="Solicitante"
          placeholder="Ej. Juan Pérez"
          className={inputClassName}
          labelClassName={labelClassName}
          value={requesterName}
          onChange={(event) => setRequesterName(event.target.value)}
        />

        <Dropdown
          label="Estado"
          placeholder="Seleccione..."
          appearance="dark"
          options={statusOptions}
          value={status}
          onChange={(value) => setStatus(String(value))}
          className={dropdownClassName}
          labelClassName={labelClassName}
          valueClassName={labelClassName}
        />

        <Button
          type="submit"
          size="giant"
          label="Aplicar filtros"
          className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
        />

        <Button
          type="button"
          size="giant"
          label="Limpiar filtros"
          onClick={handleClearFilters}
          className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
        />
      </form>

      <div className="flex flex-col">
        <DataTable
          title="Lista de requisiciones"
          data={requisitions}
          columns={columnConfig}
          pagination={
            <Pagination
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              totalRecords={totalRecords}
              onPageChange={handlePageChange}
            />
          }
        />
      </div>

      <RequisitionModal
        isOpen={isRequisitionModalOpen}
        onClose={() => {
          setIsRequisitionModalOpen(false);
          setSelectedRequisition(null);
        }}
        onSubmit={() => {
          setIsRequisitionModalOpen(false);
          setSelectedRequisition(null);
          handleRequestSuccess("Requisición guardada correctamente.");
        }}
        onRequestError={handleRequestError}
        selectedRequisition={selectedRequisition}
      />

      <RequisitionGenerateReportsModal
        isOpen={isGenerateModalOpen}
        onClose={handleCloseGenerateModal}
        options={reportOptions}
        appearance={appearance}
        selectedAction={selectedReportAction}
        onSelectedActionChange={setSelectedReportAction}
        onConfirm={handleConfirmGenerate}
        isConfirmLoading={isGeneratingPdf}
      />

      <AnimatedAlertWrapper open={alertState?.open ?? false}>
        <Alert
          type={alertState?.type!}
          title={alertState?.title}
          message={alertState?.message!}
          onClose={handleCloseAlert}
        />
      </AnimatedAlertWrapper>
    </m.div>
  );
};
