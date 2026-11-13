import { Loader } from "@app/shared/components/loaders/loader";
import { ModalInfoField } from "@app/shared/components/modal-info-field/modal-info-field";
import { Badges, Modal } from "@alpac/design-system";

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
              ? new Date(detail.created_at).toLocaleDateString()
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
          label="CENTRO DE COSTO"
          value={selectedOutput?.cost_center_name ?? "—"}
        />
        <ModalInfoField
          label="SOLICITANTE"
          value={detail.requested_by_user_name ?? "—"}
        />
        <ModalInfoField
          label="MÁQUINA/VEHÍCULO"
          value={
            [detail.machinery_code, detail.machinery_brand, detail.machinery_model]
              .filter(Boolean)
              .join(" / ") || "—"
          }
        />
        {detail.engine_hours != null ? (
          <ModalInfoField
            label="HORAS MOTOR"
            value={detail.engine_hours}
          />
        ) : detail.mileage != null ? (
          <ModalInfoField
            label="KILOMETRAJE"
            value={detail.mileage}
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
  const { isOpen, onClose, isLoading, detailData, selectedOutput, requestType } = props;

  const stocks = detailData?.inventory_stock_informations ?? [];

  const resolvedRequestType =
    detailData?.supply_request_detail
      ? "Supply"
      : detailData?.fuel_request_detail
        ? "Fuel"
        : requestType ?? selectedOutput?.request_type ?? null;

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
                          ? new Date(detailData.dispatched_at).toLocaleDateString()
                          : "—"
                      }
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 lg:pl-4">
              <div className="flex flex-col gap-2 border-t border-slate-600 pt-4 dark:border-neutral-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-200">
                    Información de artículos
                  </h3>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-200">
                    {combinedRows.length} ítems
                  </span>
                </div>

                {combinedRows.length === 0 ? (
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
                        <th className="px-3 py-2 text-right font-semibold text-gray-500 dark:text-gray-300">
                          Stock disponible
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
                          <td className="px-3 py-2 text-right font-medium">
                            {row.disponible ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};