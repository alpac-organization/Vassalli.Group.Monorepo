import { Loader } from "@app/shared/components/loaders/loader";
import { ModalInfoField } from "@app/shared/components/modal-info-field/modal-info-field";
import { Badges, Button, Modal } from "@alpac/design-system";
import { pdf } from "@react-pdf/renderer";
import { FileText } from "lucide-react";
import { InventoryOutputPDF } from "./reports/inventory-output-pdf/inventory-output-pdf";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { formatCurrency } from "@app/shared/utils/currency.utils";

import { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import { ReasonUse as ReasonUseValues } from "@app/core/enums/reason-use.enum";

const STATUS_BADGE_CLASS_NAME: Record<InventoryOutputsStatus, string> = {
  OutputPending:
    "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Dispatched:
    "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  InProgress:
    "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  Rejected:
    "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

const REQUEST_TYPE_LABEL: Record<string, string> = {
  Supply: "Insumos",
  Fuel: "Combustibles",
};

import type {
  InventoryOutputDto,
  InventoryOutputSupplyRequestDetail,
  InventoryOutputFuelRequestDetail,
} from "@app/modules/Inventory/domain/api-contract/responses/inventory-outputs.response";
import { useState } from "react";
import type { SalidasDetailModalProps } from "./salidas-detail-modal.types";

const labelForStatus = (status?: string | null) => {
  if (!status) return "—";
  const value = InventoryOutputsStatus[status as keyof typeof InventoryOutputsStatus];
  return value?.label ?? status;
};

const SupplyRequestBlock = function ({
  detail,
  selectedOutput,
}: {
  detail?: InventoryOutputSupplyRequestDetail | null;
  selectedOutput?: InventoryOutputDto | null;
}) {
  if (!detail) {
    return (
      <span className="text-sm text-slate-500 dark:text-slate-400">
        No se encontró información de la solicitud de insumos.
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badges
            color="info"
            className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
            label={detail.supply_request_code ?? "—"}
          />
          <Badges
            color="info"
            className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
            label={detail.operational_order_information?.po_code ?? detail.po_code ?? "—"}
          />
          <Badges
            color="info"
            className="bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
            label={
              ReasonUseValues[
                detail.reason_use as keyof typeof ReasonUseValues
              ]?.label ??
              detail.reason_use ??
              "—"
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ModalInfoField
          label="ÁREA"
          value={selectedOutput?.work_area_name ?? detail.work_area_name ?? "—"}
        />
        <ModalInfoField
          label="FECHA DE SOLICITUD"
          value={
            detail.created_at
              ? new Date(detail.created_at).toLocaleString()
              : "—"
          }
        />
        <ModalInfoField
          label="CENTRO DE COSTO"
          value={selectedOutput?.cost_center_name ?? "—"}
        />
        <ModalInfoField
          label="ALMACÉN"
          value={detail.warehouse_information?.code ?? detail.warehouse_code ?? "—"}
        />
        {detail.equipment_information?.code || detail.equipment_information?.brand || detail.equipment_information?.model ? (
          <ModalInfoField
            label="Activo Fijo"
            value={
              [
                detail.equipment_information?.code,
                detail.equipment_information?.brand,
                detail.equipment_information?.model,
              ]
                .filter(Boolean)
                .join(" - ") || "—"
            }
          />
        ) : null}
        {detail.customer_information?.legal_name ? (
          <ModalInfoField
            label="CLIENTE"
            value={detail.customer_information.legal_name}
          />
        ) : null}
        {detail.duca_or_transport_order ? (
          <ModalInfoField
            label="DUCA / ORDEN DE TRANSPORTE"
            value={detail.duca_or_transport_order}
          />
        ) : null}
        <ModalInfoField
          label="SOLICITANTE"
          value={detail.requested_by_user_name ?? "—"}
        />
        <ModalInfoField
          label="RAZÓN DE SALIDA"
          value={selectedOutput?.reasons_inventory_removal_description ?? "—"}
        />
        <ModalInfoField
          label="APROBADO POR"
          value={detail.approved_by_user_chief_name ?? "—"}
        />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 rounded-md bg-[#303846] p-3 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:pr-4 md:border-r md:border-slate-600 dark:md:border-neutral-600">
          <p className="text-[10px] font-semibold text-[#91A0B5]">
            JUSTIFICACIÓN DE SOLICITUD
          </p>
          <p className="text-[13px] text-[#E2E8F0]">
            {detail.justification ?? "Sin justificación."}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:pl-4">
          <p className="text-[10px] font-semibold text-[#91A0B5]">
            OBSERVACIONES DE APROBADO
          </p>
          <p className="text-[13px] text-[#E2E8F0]">
            {selectedOutput?.observations ?? "Sin observaciones."}
          </p>
        </div>
      </div>
    </div>
  );
};

const FuelRequestBlock = function ({
  detail,
  selectedOutput,
}: {
  detail?: InventoryOutputFuelRequestDetail | null;
  selectedOutput?: InventoryOutputDto | null;
}) {
  const { branchCode } = useUserStore();
  const CORINTO_BRANCH_CODES = ["ALP-CTO"];
  const isCorinto = CORINTO_BRANCH_CODES.some((code) =>
    (branchCode ?? "").toUpperCase().includes(code),
  );

  if (!detail) {
    return (
      <span className="text-sm text-slate-500 dark:text-slate-400">
        No se encontró información de la solicitud de combustible.
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badges
          color="info"
          className="bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
          label={detail.fuel_request_code ?? "—"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ModalInfoField
          label="ÁREA"
          value={selectedOutput?.work_area_name ?? detail.work_area_information?.work_area_name ?? "—"}
        />
        <ModalInfoField
          label="FECHA DE SOLICITUD"
          value={
            detail.created_at
              ? new Date(detail.created_at).toLocaleString()
              : "—"
          }
        />
        <ModalInfoField
          label="ALMACÉN"
          value={detail.warehouse_information?.code ?? "—"}
        />
        <ModalInfoField
          label="CENTRO DE COSTO"
          value={selectedOutput?.cost_center_name ?? detail.cost_center_information?.cost_center_name ?? detail.cost_center_information?.cost_center_code ?? "—"}
        />
        <ModalInfoField
          label="SOLICITANTE"
          value={detail.requested_by_user_name ?? "—"}
        />
        {isCorinto || detail.customer_information?.legal_name ? (
          <ModalInfoField
            label="CLIENTE"
            value={detail.customer_information?.legal_name ?? "—"}
          />
        ) : null}
        <ModalInfoField
          label="ACTIVO FIJO"
          value={
            [
               detail.equipment_information?.code ?? detail.machinery_code,
               detail.equipment_information?.brand ?? detail.machinery_brand,
               detail.equipment_information?.model ?? detail.machinery_model,
             ]
              .filter(Boolean)
              .join(" / ") || "—"
          }
        />
        <ModalInfoField
          label="CANTIDAD SOLICITADA"
          value={
            <>
              {Number(detail.requested_quantity ?? 0).toLocaleString("es-NI", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {detail.unit_measure_symbol ?? ""}
              <div className="text-xs text-slate-400">
                (
                {Number(detail.requested_quantity_litters ?? 0).toLocaleString("es-NI", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                L)
              </div>
            </>
          }
        />
        {detail.engine_hours != null || detail.previous_engine_hours != null ? (
          <ModalInfoField
            label="HORAS MOTOR"
            value={
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-xs text-slate-400">Anterior: </span>
                  {detail.previous_engine_hours != null ? detail.previous_engine_hours + " hrs" : "—"}
                </div>
                <div>
                  <span className="text-xs text-slate-400">Actual: </span>
                  {detail.engine_hours != null ? detail.engine_hours + " hrs" : "—"}
                </div>
              </div>
            }
          />
        ) : detail.mileage != null || detail.previous_mileage != null ? (
          <ModalInfoField
            label="KILOMETRAJE"
            value={
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-xs text-slate-400">Anterior: </span>
                  {detail.previous_mileage != null ? detail.previous_mileage + " km" : "—"}
                </div>
                <div>
                  <span className="text-xs text-slate-400">Actual: </span>
                  {detail.mileage != null ? detail.mileage + " km" : "—"}
                </div>
              </div>
            }
          />
        ) : null}
        <ModalInfoField
          label="RAZÓN DE SALIDA"
          value={selectedOutput?.reasons_inventory_removal_description ?? "—"}
        />
        <ModalInfoField
          label="APROBADO POR"
          value={detail.approved_by_user_chief_name ?? "—"}
        />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 rounded-md bg-[#303846] p-3 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:pr-4 md:border-r md:border-slate-600 dark:md:border-neutral-600">
          <p className="text-[10px] font-semibold text-[#91A0B5]">
            JUSTIFICACIÓN DE SOLICITUD
          </p>
          <p className="text-[13px] text-[#E2E8F0]">
            {detail.justification ?? "Sin justificación."}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:pl-4">
          <p className="text-[10px] font-semibold text-[#91A0B5]">
            OBSERVACIONES DE APROBADO
          </p>
          <p className="text-[13px] text-[#E2E8F0]">
            {selectedOutput?.observations ?? "Sin observaciones."}
          </p>
        </div>
      </div>

      {detail.annulled_by_user_chief_name ? (
        <ModalInfoField
          label="ANULADO POR"
          value={detail.annulled_by_user_chief_name}
        />
      ) : null}
    </div>
  );
};

export const SalidasDetailModal = function (props: SalidasDetailModalProps) {
  const {
    isOpen,
    onClose,
    isLoading,
    detailData,
    selectedOutput,
    requestType,
    onStartDispatch,
    onConfirmDispatch,
    onRejectDispatch,
    isStartingDispatch,
    isConfirmingDispatch,
    isRejectingDispatch,
  } = props;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGeneratePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await pdf(
        <InventoryOutputPDF data={{ detailData, selectedOutput }} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generating inventory output PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const resolvedRequestType =
    detailData?.supply_request_detail
      ? "Supply"
      : detailData?.fuel_request_detail
        ? "Fuel"
        : requestType ?? selectedOutput?.request_type ?? null;

  const stocks = detailData?.inventory_stock_informations ?? [];

  const combinedRows =
    resolvedRequestType === "Supply"
      ? (detailData?.supply_request_detail?.items ?? []).map((item) => ({
        key: item.supply_request_item_id,
        insumo: item.product_stock_name ?? "Producto",
        solicitada: item.amount,
        disponible:
          stocks.find((stock) => stock.inventory_stock_id === item.product_stock_id)
            ?.available_quantity ?? null,
      }))
      : resolvedRequestType === "Fuel" && detailData?.fuel_request_detail
        ? [
          {
            key: detailData.fuel_request_detail.fuel_request_id ?? "fuel",
            insumo: detailData.fuel_request_detail.product_stock_name ?? "Producto",
            solicitada: detailData.fuel_request_detail.requested_quantity ?? null,
            disponible:
              stocks.find(
                (stock) =>
                  stock.inventory_stock_id ===
                  detailData.fuel_request_detail?.product_stock_id,
              )?.available_quantity ?? null,
          },
        ]
        : [];

  const statusBadgeClass = selectedOutput
    ? STATUS_BADGE_CLASS_NAME[selectedOutput.status]
    : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700";

  const hasDispatchData =
    Boolean(detailData?.dispatched_by_user_name) ||
    Boolean(detailData?.dispatched_at);

  const statusLabel = selectedOutput
    ? labelForStatus(selectedOutput.status)
    : "—";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de salida de inventario"
      description="Consulta la información general, solicitud asociada, stock y despacho de la salida."
      variant="default"
      size="7xl"
    >
      {isLoading ? (
        <div className="py-8">
          <Loader title="Cargando detalle de la salida..." />
        </div>
      ) : !detailData && !selectedOutput ? (
        <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No se encontró información de la salida.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badges
                color="info"
                className="bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700"
                label={selectedOutput?.output_code ?? "Salida de inventario"}
              />
              <Badges
                color="info"
                className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                label={
                  REQUEST_TYPE_LABEL[
                  selectedOutput?.request_type ?? resolvedRequestType ?? ""
                  ] ??
                  selectedOutput?.request_type ??
                  resolvedRequestType ??
                  "—"
                }
              />
              {selectedOutput?.status === "Dispatched" ? (
                <button
                  type="button"
                  onClick={() => void handleGeneratePdf()}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                  title="Generar imprimible PDF"
                >
                  <FileText size={18} />
                </button>
              ) : null}
            </div>
            <Badges
              color="info"
              className={statusBadgeClass}
              label={statusLabel}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
            <div className="flex flex-col gap-4 lg:pr-4 lg:border-r lg:border-slate-600 dark:lg:border-neutral-600">
              <div className="flex flex-col gap-4 border-t border-slate-600 pt-4 dark:border-neutral-600">
                <h3 className="text-sm font-semibold text-slate-200">
                  Información de Solicitud
                </h3>

                {resolvedRequestType === "Supply" ? (
                  <SupplyRequestBlock
                    detail={detailData?.supply_request_detail}
                    selectedOutput={selectedOutput}
                  />
                ) : resolvedRequestType === "Fuel" ? (
                  <FuelRequestBlock
                    detail={detailData?.fuel_request_detail}
                    selectedOutput={selectedOutput}
                  />
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Tipo de solicitud no disponible.
                  </span>
                )}
              </div>

            </div>

            <div className="flex flex-col gap-4 lg:pl-4">
              <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">
                    {selectedOutput?.status === "Dispatched" && detailData?.kardex_movements?.length
                      ? "Movimiento de Kardex"
                      : "Información de artículos"}
                  </h3>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-200">
                    {selectedOutput?.status === "Dispatched" && detailData?.kardex_movements?.length
                      ? `${detailData.kardex_movements.length} movimientos`
                      : `${combinedRows.length} ítems`}
                  </span>
                </div>

                {selectedOutput?.status === "Dispatched" && detailData?.kardex_movements?.length ? (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-600 dark:border-neutral-600">
                        <th className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-300">
                          N°Item
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-300">
                          Código de inventario
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-300">
                          Nombre de producto
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                          Cantidad Solicitada
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                          Costo
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                          Costo Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailData.kardex_movements.map((movement, index) => (
                        <tr
                          key={movement.kardex_id ?? index}
                          className="border-b border-slate-600 dark:border-neutral-600"
                        >
                          <td className="px-3 py-2">{index + 1}</td>
                          <td className="px-3 py-2">
                            {movement.product_information?.product_code ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            {movement.product_information?.product_name ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {movement.units != null
                              ? `${movement.units} ${movement.unit_measure_information?.symbol ?? ""}`.trim()
                              : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {movement.unit_cost != null ? formatCurrency(movement.unit_cost) : "—"}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {movement.total_output != null ? formatCurrency(movement.total_output) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : combinedRows.length === 0 ? (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Sin ítems ni stock relacionado.
                  </span>
                ) : (
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-600 dark:border-neutral-600">
                        <th className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-300">
                          Insumo
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                          Cantidad solicitada
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinedRows.map((row) => (
                        <tr
                          key={row.key}
                          className="border-b border-slate-600 dark:border-neutral-600"
                        >
                          <td className="px-3 py-2">{row.insumo}</td>
                          <td className="px-3 py-2 text-right font-medium">
                            {row.solicitada ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {hasDispatchData ? (
                <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
                  <h3 className="text-sm font-semibold text-slate-200">Despacho</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ModalInfoField
                      label="DESPACHADO POR"
                      value={detailData?.dispatched_by_user_name ?? "—"}
                    />
                    <ModalInfoField
                      label="FECHA DE DESPACHO"
                      value={
                        detailData?.dispatched_at
                          ? new Date(detailData.dispatched_at).toLocaleString()
                          : "—"
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        <div className="flex justify-end gap-2 pt-4">
          {selectedOutput?.status === "OutputPending" ? (
            <>
              <Button
                label="Rechazar"
                onClick={() => void onRejectDispatch?.()}
                disabled={isRejectingDispatch}
                isLoading={isRejectingDispatch}
                className="rounded-md! h-10 px-4! border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/60 hover:text-red-700 dark:hover:text-red-300 shadow-sm transition-all duration-200"
              />
              <Button
                label="Iniciar despacho"
                onClick={() => void onStartDispatch?.()}
                disabled={isStartingDispatch}
                isLoading={isStartingDispatch}
                className="rounded-md! h-11 px-6! border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-blue-300 shadow-sm transition-all duration-200 text-[14px] font-semibold"
              />
            </>
          ) : selectedOutput?.status === "InProgress" ? (
            <Button
              label="Confirmar despacho"
              onClick={() => void onConfirmDispatch?.()}
              disabled={isConfirmingDispatch}
              isLoading={isConfirmingDispatch}
              className="rounded-md! h-11 px-6! border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-sm transition-all duration-200 text-[14px] font-semibold"
            />
          ) : null}
        </div>
        </div>
      )}
    </Modal>
  );
};