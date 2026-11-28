import {
   ArrowDownLeftIcon,
   ArrowUpRightIcon,
   BuildingIcon,
   CalendarIcon,
   CoinsIcon,
   FileTextIcon,
   LandmarkIcon,
   MapPinIcon,
   PackageIcon,
   RulerIcon,
   ScaleIcon,
   UserIcon,
} from "lucide-react";
import {
   Badges,
   Banner,
   Button,
   MetricCard,
   Modal,
   SectionHeader,
} from "@alpac/design-system";

import { useUserStore } from "@app/shared/stores/useUserStore";
import { Loader } from "@app/shared/components/loaders/loader";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { formatBranchDisplay } from "@app/shared/utils/branch-display.utils";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { KardexType } from "@app/core/enums/kardex-type.enum";
import { KardexMovementType } from "@app/core/enums/kardex-movement-type.enum";
import { InventoryOutputsStatus } from "@app/core/enums/inventory-output-status.enum";
import {
   ReferenceType,
   resolveReferenceTypeMeta,
} from "@app/core/enums/reference-type.enum";
import { useKardexMovements } from "@app/modules/Inventory/ui/hooks/useKardexMovements";
import { buttonCancelClass } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/generate-exit-modal/utils/style.exit-modal";

import {
   KardexMovementTypeColorBadges,
   resolveKardexMovementDateTime,
} from "../../kardex-movement.variants";
import type { KardexDetailModalProps } from "./kardex-detail-modal.types";

const ICON_CLASS = "text-slate-500 dark:text-slate-300";
const SECTION_GRID_CLASS =
   "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4";
const CODE_BADGE_CLASS =
   "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700";
const CATEGORY_BADGE_CLASS =
   "bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800";
const KARDEX_TYPE_BADGE_CLASS =
   "bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800";
const COST_CENTER_BADGE_CLASS =
   "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";

const QUANTITY_FORMATTER = new Intl.NumberFormat("es-NI", {
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
});

const formatUnits = (value?: number | null, symbol?: string | null) => {
   if (value === null || value === undefined) return "—";
   const formatted = QUANTITY_FORMATTER.format(value);
   return symbol ? `${formatted} ${symbol}` : formatted;
};

const resolveRequestTypeLabel = (requestType?: string | null) => {
   if (requestType === "Supply") return "Requisición de insumos";
   if (requestType === "Fuel") return "Boleta de combustible";
   return "—";
};

export const KardexDetailModal = function (props: KardexDetailModalProps) {
   const { isOpen, movement, onClose } = props;
   const { companyId, moduleCode } = useUserStore();

   const { GetKardexMovementDetailQuery } = useKardexMovements({
      payloadGetKardexMovementDetailRequest:
         isOpen && movement
            ? {
                 company_id: companyId,
                 module_code: moduleCode,
                 kardex_id: movement.kardex_id,
              }
            : undefined,
   });

   const detail = GetKardexMovementDetailQuery.data ?? null;
   const isLoading =
      GetKardexMovementDetailQuery.isPending ||
      GetKardexMovementDetailQuery.isFetching;
   const hasError =
      !isLoading && (GetKardexMovementDetailQuery.isError || !detail);

   const current = detail ?? movement;
   const product = current?.product_information ?? null;
   const unit = current?.unit_measure_information ?? null;
   const costCenter = current?.cost_center_information ?? null;
   const workArea = current?.work_area_information ?? null;
   const branch = current?.branch_information ?? null;
   const user = detail?.movement_by_user_information ?? null;

   const isExit = current?.movement_type === "Exit";
   const movementAmount = isExit
      ? (current?.total_output ?? 0)
      : (current?.total_input ?? 0);

   const transactionDateTime = current
      ? resolveKardexMovementDateTime(current)
      : "";

   const outputStatusLabel =
      detail?.inventory_output_status &&
      InventoryOutputsStatus[detail.inventory_output_status]
         ? InventoryOutputsStatus[detail.inventory_output_status].label
         : null;

   const referenceTypeMeta =
      resolveReferenceTypeMeta(current?.reference_type) ??
      (current?.movement_type === "Buys"
         ? ReferenceType.FT
         : current?.output_request_type === "Fuel"
           ? ReferenceType.BL
           : current?.output_request_type === "Supply"
             ? ReferenceType.RQ
             : null);

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Detalle de movimiento Kardex"
         description="Consulta la trazabilidad contable, centro de costo, usuario responsable y saldos resultantes del movimiento."
         variant="default"
         size="5xl"
         panelClassName="rounded-xl sm:!rounded-2xl !p-4 sm:!p-6"
      >
         {isLoading ? (
            <div className="py-8">
               <Loader title="Cargando detalle del movimiento..." />
            </div>
         ) : !current ? (
            <Banner
               variant="info"
               title="Sin información"
               description="No se encontró información del movimiento de Kardex."
            />
         ) : hasError ? (
            <div className="flex flex-col gap-3">
               <Banner
                  variant="error"
                  title="No se pudo cargar el detalle"
                  description="Ocurrió un problema al consultar el detalle del movimiento de Kardex. Intenta nuevamente."
               />
               <div className="flex justify-end">
                  <Button
                     type="button"
                     size="medium"
                     label="Reintentar"
                     onClick={() => void GetKardexMovementDetailQuery.refetch()}
                     className="w-full! rounded-md! bg-alpac-primary-500! text-white! dark:bg-alpac-primary-700! sm:w-auto!"
                  />
               </div>
            </div>
         ) : (
            <div className="flex flex-col gap-5">
               <SectionHeader
                  title={product?.product_name ?? "Movimiento de Kardex"}
                  subtitle={product?.description || undefined}
               >
                  {product?.product_code && (
                     <Badges
                        label={product.product_code}
                        color="info"
                        className={CODE_BADGE_CLASS}
                     />
                  )}
                  {product?.category_information?.name && (
                     <Badges
                        label={product.category_information.name}
                        color="info"
                        className={CATEGORY_BADGE_CLASS}
                     />
                  )}
                  <Badges
                     label={
                        KardexType[current.kardex_type]?.label ??
                        current.kardex_type
                     }
                     color="info"
                     className={KARDEX_TYPE_BADGE_CLASS}
                  />
                  <Badges
                     label={
                        KardexMovementType[current.movement_type]?.label ??
                        current.movement_type
                     }
                     color="info"
                     className={
                        KardexMovementTypeColorBadges[current.movement_type]
                     }
                  />
                  {referenceTypeMeta && (
                     <Badges
                        label={referenceTypeMeta.label}
                        color="info"
                        className={referenceTypeMeta.badgeColor}
                     />
                  )}
                  {costCenter?.cost_center_name && (
                     <Badges
                        label={costCenter.cost_center_name}
                        color="info"
                        className={COST_CENTER_BADGE_CLASS}
                     />
                  )}
               </SectionHeader>

               <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <MetricCard
                     size="compact"
                     title={isExit ? "Unidades de salida" : "Unidades de entrada"}
                     value={formatUnits(current.units, unit?.symbol)}
                     icon={
                        isExit ? (
                           <ArrowUpRightIcon size={14} />
                        ) : (
                           <ArrowDownLeftIcon size={14} />
                        )
                     }
                     themeClass={isExit ? "bg-orange-500" : "bg-sky-500"}
                  />
                  <MetricCard
                     size="compact"
                     title="Costo unitario"
                     value={formatCurrency(current.unit_cost)}
                     icon={<CoinsIcon size={14} />}
                     themeClass="bg-violet-500"
                  />
                  <MetricCard
                     size="compact"
                     title={isExit ? "Total salida" : "Total entrada"}
                     value={formatCurrency(movementAmount)}
                     icon={<ScaleIcon size={14} />}
                     themeClass={isExit ? "bg-amber-500" : "bg-blue-500"}
                  />
                  <MetricCard
                     size="compact"
                     title="Saldo valorizado"
                     value={formatCurrency(current.total_kardex)}
                     icon={<PackageIcon size={14} />}
                     themeClass="bg-emerald-500"
                  />
               </div>

               <SectionHeader
                  title="Saldos de inventario y costo promedio"
                  subtitle="Comparativa de existencias y valoración antes y después del movimiento."
                  hasBorder
               >
                  <div className={SECTION_GRID_CLASS}>
                     <DetailField
                        label="Existencia previa"
                        value={formatUnits(detail?.previous_units, unit?.symbol)}
                        icon={<PackageIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Saldo previo valorizado"
                        value={
                           detail !== null
                              ? formatCurrency(detail.previous_kardex)
                              : "—"
                        }
                        icon={<CoinsIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Saldo final unidades"
                        value={formatUnits(current.total_units, unit?.symbol)}
                        icon={<PackageIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Costo promedio ponderado"
                        value={formatCurrency(current.average_cost)}
                        description={
                           unit?.name ? `Por ${unit.name.toLowerCase()}` : undefined
                        }
                        icon={<ScaleIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                  </div>
               </SectionHeader>

               <SectionHeader
                  title="Ubicación y trazabilidad"
                  subtitle="Sucursal, área, centro de costo, fecha de transacción y usuario responsable."
                  hasBorder
               >
                  <div className={SECTION_GRID_CLASS}>
                     {(() => {
                        const branchDisplay = formatBranchDisplay(branch);
                        return (
                           <DetailField
                              label="Sucursal"
                              value={branchDisplay.primary}
                              description={branchDisplay.secondary}
                              icon={<MapPinIcon size={18} className={ICON_CLASS} aria-hidden />}
                           />
                        );
                     })()}
                     <DetailField
                        label="Área de trabajo"
                        value={workArea?.work_area_name ?? "—"}
                        description={
                           workArea?.work_area_code
                              ? `Código: ${workArea.work_area_code}`
                              : undefined
                        }
                        icon={<BuildingIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Centro de costo"
                        value={costCenter?.cost_center_name ?? "—"}
                        description={
                           costCenter?.cost_center_code
                              ? `Código: ${costCenter.cost_center_code}`
                              : undefined
                        }
                        icon={<LandmarkIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Unidad de medida"
                        value={unit?.name ?? "—"}
                        description={
                           unit?.symbol ? `Símbolo: ${unit.symbol}` : undefined
                        }
                        icon={<RulerIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Fecha y hora de movimiento"
                        value={transactionDateTime || "—"}
                        icon={<CalendarIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Registrado por"
                        value={user?.fullname ?? user?.email ?? "—"}
                        description={
                           user?.fullname && user?.email ? user.email : undefined
                        }
                        icon={<UserIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                     <DetailField
                        label="Documento"
                        value={referenceTypeMeta?.label ?? "—"}
                        description={
                           current.document_number
                              ? `N° ${current.document_number}`
                              : undefined
                        }
                        icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                     />
                  </div>
               </SectionHeader>

               {detail?.inventory_entry_id && (
                  <SectionHeader
                     title="Documento de entrada asociado"
                     subtitle="Información de la compra y entrada de almacén que originó este movimiento."
                     hasBorder
                  >
                     <div className={SECTION_GRID_CLASS}>
                        <DetailField
                           label="Código de entrada"
                           value={
                              detail.inventory_entry_code?.toUpperCase() ?? "—"
                           }
                           description={
                              [
                                 detail.purchase_request_code
                                    ? `Requisición: ${detail.purchase_request_code.toUpperCase()}`
                                    : null,
                                 detail.purchase_order_code
                                    ? `OC: ${detail.purchase_order_code.toUpperCase()}`
                                    : null,
                              ]
                                 .filter(Boolean)
                                 .join(" · ") || undefined
                           }
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                        <DetailField
                           label="Número de factura"
                           value={detail.invoice_number ?? "—"}
                           description={
                              detail.invoice_date
                                 ? `Fecha: ${detail.invoice_date}`
                                 : undefined
                           }
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                        <DetailField
                           label="Proveedor"
                           value={detail.supplier_name ?? "—"}
                           icon={<BuildingIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                        <DetailField
                           label="Observaciones"
                           value={detail.entry_observations ?? "—"}
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                     </div>
                  </SectionHeader>
               )}

               {detail?.inventory_output_id && (
                  <SectionHeader
                     title="Documento de salida asociado"
                     subtitle="Información del despacho de almacén que originó este movimiento."
                     hasBorder
                  >
                     <div className={SECTION_GRID_CLASS}>
                        <DetailField
                           label="Código de salida"
                           value={detail.inventory_output_code ?? "—"}
                           description={
                              outputStatusLabel
                                 ? `Estado: ${outputStatusLabel}`
                                 : undefined
                           }
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                        <DetailField
                           label="Solicitud origen"
                           value={detail.output_request_code ?? "—"}
                           description={resolveRequestTypeLabel(
                              detail.output_request_type,
                           )}
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                        <DetailField
                           label="Motivo de salida"
                           value={detail.reason_removal_description ?? "—"}
                           icon={<FileTextIcon size={18} className={ICON_CLASS} aria-hidden />}
                        />
                     </div>
                  </SectionHeader>
               )}

               <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-neutral-600">
                  <Button
                     type="button"
                     label="Cerrar"
                     onClick={onClose}
                     className={buttonCancelClass}
                  />
               </div>
            </div>
         )}
      </Modal>
   );
};
