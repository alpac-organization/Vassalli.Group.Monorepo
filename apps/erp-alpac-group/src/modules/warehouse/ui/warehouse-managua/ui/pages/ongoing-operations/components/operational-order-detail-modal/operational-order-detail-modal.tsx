import { useMemo } from "react";
import { Badges, Button, Modal } from "@alpac/design-system";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Edit3,
  FileSpreadsheet,
  FileText,
  Info,
  Landmark,
  Package,
  Scale,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { parseOperationalOrderAdditionalData } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import { getOperationalOrderStatusLabel } from "@app/modules/warehouse/domain/enums/warehouse-managua/operational-order-status.enum";
import { sectionTitleClassName } from "../../utils/styles";
import type { OperationalOrderDetailModalProps } from "./types/operational-order-detail-modal.types";

export function OperationalOrderDetailModal({
  isOpen,
  onClose,
  orderId,
  onOpenUpdateInfo,
}: OperationalOrderDetailModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const detailPayload = useMemo(
    () =>
      isOpen && orderId && companyId && moduleCode
        ? {
            company_id: companyId,
            module_code: moduleCode,
            operational_order_id: orderId,
          }
        : null,
    [isOpen, orderId, companyId, moduleCode],
  );

  const { GetOperationalOrderDetail } = useOperationalOrders({
    detailPayload,
  });

  const { data: detail, isLoading } = GetOperationalOrderDetail;

  const parsedAdditionalData = useMemo(() => {
    return parseOperationalOrderAdditionalData(
      detail?.reception_entrance_information?.additional_data,
    );
  }, [detail?.reception_entrance_information?.additional_data]);

  const documentNumbers = parsedAdditionalData?.document_numbers ?? [];

  const receptionInfo = detail?.reception_entrance_information;
  const transportInfo =
    receptionInfo?.reception_transport_entrance_information ??
    detail?.reception_transport_entrance_information;

  return (
    <Modal
      isOpen={isOpen && Boolean(orderId)}
      onClose={onClose}
      variant="default"
      size="5xl"
      title={detail?.po_code ? `Orden Operacional — ${detail.po_code}` : "Detalle de Orden Operacional"}
      description="Consulta la información general, cliente, centro de costo y recepción asociada a la orden."
      panelClassName={[
        "flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
        "!mx-2 !my-2 sm:!mx-4 sm:!my-6",
        "rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
      ].join(" ")}
      contentClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {isLoading ? (
          <div className="px-3 py-16 text-center">
            <Loader title="Cargando detalle de la orden operacional..." />
          </div>
        ) : !detail ? (
          <div className="px-3 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No se encontró información para la orden operacional seleccionada.
          </div>
        ) : (
          <>
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
              <div className="flex flex-col gap-5 pb-2">
                {/* Sección 1: Información General de la Orden */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Información general</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Código PO"
                      value={
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {detail.po_code}
                        </span>
                      }
                      icon={<FileSpreadsheet size={18} />}
                    />
                    <DetailField
                      label="No. Documento"
                      value={detail.document_number || "—"}
                      icon={<FileText size={18} />}
                    />
                    <DetailField
                      label="Estado"
                      value={
                        <Badges
                          label={getOperationalOrderStatusLabel(detail.status)}
                          color="warning"
                          className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800 w-fit! px-2.5! py-0.5! text-xs font-semibold"
                        />
                      }
                      icon={<CheckCircle2 size={18} />}
                    />
                    <DetailField
                      label="Alerta"
                      value={
                        detail.is_alerted ? (
                          <Badges
                            label="Alerta activa"
                            color="danger"
                            className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800 w-fit! px-2! py-0.5! text-xs"
                          />
                        ) : (
                          <Badges
                            label="Normal"
                            color="success"
                            className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:border-emerald-800 w-fit! px-2! py-0.5! text-xs"
                          />
                        )
                      }
                      icon={<AlertCircle size={18} />}
                    />
                    <DetailField
                      label="Cantidad de Bultos"
                      value={
                        detail.packages_count != null
                          ? `${Number(detail.packages_count).toLocaleString()} bultos`
                          : "—"
                      }
                      icon={<Package size={18} />}
                    />
                    <DetailField
                      label="Peso Total"
                      value={
                        detail.weight != null
                          ? `${Number(detail.weight).toLocaleString()} kg`
                          : "—"
                      }
                      icon={<Scale size={18} />}
                    />
                    {detail.policy_number && (
                      <DetailField
                        label="No. Póliza"
                        value={detail.policy_number}
                        icon={<FileText size={18} />}
                      />
                    )}
                    {detail.description && (
                      <DetailField
                        label="Descripción"
                        value={detail.description}
                        containerClass="sm:col-span-2 lg:col-span-3"
                        icon={<Info size={18} />}
                      />
                    )}
                  </div>
                </section>

                {/* Sección 2: Cliente y Centro de Costos */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Cliente y Centro de Costos</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Cliente"
                      value={detail.customer_information?.customer_name || "—"}
                      icon={<User size={18} />}
                    />
                    <DetailField
                      label="CIF / Identificación"
                      value={detail.customer_information?.cif || "—"}
                      icon={<FileText size={18} />}
                    />
                    <DetailField
                      label="Centro de Costos"
                      value={detail.cost_center_information?.cost_center_name || "—"}
                      icon={<Building2 size={18} />}
                    />
                    <DetailField
                      label="Código Centro"
                      value={
                        detail.cost_center_information?.cost_center_code != null
                          ? String(detail.cost_center_information.cost_center_code)
                          : "—"
                      }
                      icon={<Landmark size={18} />}
                    />
                    <DetailField
                      label="Código Coil"
                      value={
                        detail.cost_center_information?.coil_code != null
                          ? String(detail.cost_center_information.coil_code)
                          : "—"
                      }
                      icon={<FileSpreadsheet size={18} />}
                    />
                  </div>
                </section>

                {/* Sección 3: Datos de Recepción y Transporte */}
                {receptionInfo && (
                  <section className="flex flex-col gap-3">
                    <h4 className={sectionTitleClassName}>Información de recepción</h4>
                    <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <DetailField
                        label="Código de Recepción"
                        value={receptionInfo.reception_code || "—"}
                        icon={<ShieldCheck size={18} />}
                      />
                      <DetailField
                        label="Placa de Vehículo"
                        value={
                          transportInfo?.vehicle_plate_number? (
                            <span className="font-semibold tracking-wider text-slate-800 dark:text-slate-100">
                              {transportInfo.vehicle_plate_number}
                            </span>
                          ) : (
                            "—"
                          )
                        }
                        icon={<Truck size={18} />}
                      />
                      <DetailField
                        label="Conductor"
                        value={transportInfo?.driver_name || "—"}
                        icon={<User size={18} />}
                      />
                      <DetailField
                        label="Chasis / Remolque"
                        value={transportInfo?.vehicle_chassis_number || "—"}
                        icon={<Truck size={18} />}
                      />                   </div>

                    {documentNumbers.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2 p-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Documentos de Recepción ({documentNumbers.length})
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {documentNumbers.map((doc, idx) => (
                            <Badges
                              key={doc.document_id || idx}
                              label={doc.document_numbers}
                              color="transparent"
                              className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-3! py-1! font-medium"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </div>
            </div>

            {/* Footer estándar */}
            <div className="-mx-4 -mb-4 mt-4 shrink-0 border-t border-t-slate-200 bg-white px-4 py-3 dark:border-t-neutral-700 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl flex justify-end gap-3">
              {onOpenUpdateInfo && (
                <Button
                  type="button"
                  size="medium"
                  label="Registrar información"
                  icon={<Edit3 size={16} />}
                  onClick={() => onOpenUpdateInfo(detail.operation_order_id)}
                  className="w-full sm:w-auto text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! hover:bg-alpac-primary-600! rounded-md!"
                />
              )}
              <Button
                type="button"
                size="medium"
                label="Cerrar"
                icon={<X size={16} />}
                ariaLabel="Cerrar detalle"
                onClick={onClose}
                className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
