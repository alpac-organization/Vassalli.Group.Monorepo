import { useMemo } from "react";
import { Badges, Button, Modal } from "@alpac/design-system";
import dayjs from "dayjs";
import {
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Package,
  Send,
  ShieldAlert,
  Truck,
  Users,
  XIcon,
} from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import type { AssignmentOperationalDetailsDto } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/warehouse-assignment/get-assignment-details";
import {
  canSendAssignmentToUnloading,
  getAssignmentStatusBadgeProps,
  getDestinationLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/assignment-page.utils";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/warehouse-assignment/utils/styles";

interface AssignmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationalOrderId: string | null;
  assignmentId: string | null;
  onManageCollaborators?: () => void;
  onManageMachinery?: () => void;
  onSendToUnloading?: (assignment: AssignmentOperationalDetailsDto) => void;
  isSendingToUnloading?: boolean;
}

function resolveWarehouseTypeLabel(type?: number | string | null): string {
  if (type == null) return "—";
  const val = String(type).trim().toLowerCase();
  if (val === "1" || val === "fiscal") return "Fiscal";
  if (val === "2" || val === "granel") return "Granel";
  if (val === "3" || val === "nationalized" || val === "nacionalizada")
    return "Nacionalizada";
  return String(type);
}

export function AssignmentDetailModal({
  isOpen,
  onClose,
  operationalOrderId,
  assignmentId,
  onManageCollaborators,
  onManageMachinery,
  onSendToUnloading,
  isSendingToUnloading,
}: AssignmentDetailModalProps) {
  const { companyId, moduleCode } = useUserStore();

  const payloadAssignmentDetails = useMemo(() => {
    if (!isOpen || !operationalOrderId || !assignmentId) return null;
    return {
      company_id: companyId,
      module_code: moduleCode,
      operational_order_id: operationalOrderId,
      assignment_id: assignmentId,
    };
  }, [isOpen, operationalOrderId, assignmentId, companyId, moduleCode]);

  const { GetAssignmentDetails } = useWarehouseAssignment({
    payloadAssignmentDetails,
  });

  const { data: detail, isLoading } = GetAssignmentDetails;

  const statusBadge = getAssignmentStatusBadgeProps(detail?.status);
  const isAlerted = Boolean(detail?.is_alerted);
  const destinationType = detail?.destination_type;
  const createdAt = detail?.created_at;
  const merchandise = detail?.merchandise || "—";
  const merchandiseDescription = detail?.merchandise_description ?? "—";
  const warehouseInfo = detail?.warehouse_information;
  const hasMachinery = Boolean(detail?.has_machinery_assigned);
  const hasCollaborators = Boolean(detail?.has_collaborators_assigned);

  return (
    <Modal
      isOpen={isOpen && Boolean(assignmentId)}
      onClose={onClose}
      variant="default"
      size="4xl"
      title="Detalle de Asignación Operativa"
      description="Consulta los detalles de la mercancía, destino, recursos asignados y observaciones."
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
            <Loader title="Cargando detalle de la asignación..." />
          </div>
        ) : !detail ? (
          <div className="px-3 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No se encontró la información de la asignación seleccionada.
          </div>
        ) : (
          <>
            <div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
              <div className="flex flex-col gap-5 pb-2">
                {/* Información General (Estado, Alerta, Fecha) */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Información general</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Estado"
                      value={
                        <Badges
                          label={statusBadge.label}
                          color="transparent"
                          className={`${statusBadge.className} w-fit!`}
                        />
                      }
                      icon={<CheckCircle2 size={18} />}
                    />

                    {isAlerted && (
                      <DetailField
                        label="Alerta"
                        value={
                          <Badges
                            label="Mercadería alertada"
                            color="danger"
                            className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800 w-fit! px-2.5! py-0.5! text-xs font-bold"
                          />
                        }
                        icon={
                          <ShieldAlert size={18} className="text-red-500" />
                        }
                      />
                    )}

                    <DetailField
                      label="Fecha de Creación"
                      value={
                        createdAt
                          ? dayjs(createdAt).format("DD/MM/YYYY HH:mm")
                          : "—"
                      }
                      icon={<Calendar size={18} />}
                    />
                  </div>
                </section>

                {/* Mercancía */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>
                    Información de la mercancía
                  </h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Mercancía"
                      value={merchandise}
                      icon={<Package size={18} />}
                    />
                    <DetailField
                      label="Descripción"
                      value={merchandiseDescription}
                      icon={<FileText size={18} />}
                      containerClass="sm:col-span-2"
                    />
                  </div>
                </section>

                {/* Destino y Almacén */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Destino y almacén</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Tipo de Destino"
                      value={getDestinationLabel(destinationType)}
                      icon={<Building2 size={18} />}
                    />
                    <DetailField
                      label="Código de Almacén"
                      value={warehouseInfo?.code || "—"}
                      icon={<Building2 size={18} />}
                    />
                    <DetailField
                      label="Tipo de Almacén"
                      value={resolveWarehouseTypeLabel(
                        warehouseInfo?.warehouse_type,
                      )}
                      icon={<FileText size={18} />}
                    />
                  </div>
                </section>

                {/* Recursos asignados */}
                <section className="flex flex-col gap-3">
                  <h4 className={sectionTitleClassName}>Recursos asignados</h4>
                  <div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailField
                      label="Maquinaria"
                      value={
                        <div className="flex items-center gap-2">
                          <Badges
                            label={hasMachinery ? "Asignada" : "No asignada"}
                            color="transparent"
                            className={
                              hasMachinery
                                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 w-fit! px-2.5! py-0.5! text-xs font-semibold"
                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 w-fit! px-2.5! py-0.5! text-xs font-semibold"
                            }
                          />
                          {onManageMachinery && (
                            <button
                              type="button"
                              onClick={onManageMachinery}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                            >
                              Gestionar
                            </button>
                          )}
                        </div>
                      }
                      icon={<Truck size={18} />}
                    />

                    <DetailField
                      label="Colaboradores"
                      value={
                        <div className="flex items-center gap-2">
                          <Badges
                            label={
                              hasCollaborators ? "Asignados" : "No asignados"
                            }
                            color="transparent"
                            className={
                              hasCollaborators
                                ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800 w-fit! px-2.5! py-0.5! text-xs font-semibold"
                                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 w-fit! px-2.5! py-0.5! text-xs font-semibold"
                            }
                          />
                          {onManageCollaborators && (
                            <button
                              type="button"
                              onClick={onManageCollaborators}
                              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
                            >
                              Gestionar
                            </button>
                          )}
                        </div>
                      }
                      icon={<Users size={18} />}
                    />
                  </div>
                </section>

                {/* Observaciones */}
                {detail.observations && (
                  <section className="flex flex-col gap-3">
                    <h4 className={sectionTitleClassName}>Observaciones</h4>
                    <div className="grid grid-cols-1 p-1 gap-4">
                      <DetailField
                        label="Observaciones"
                        value={detail.observations}
                        icon={<FileText size={18} />}
                      />
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Footer estándar de modal de detalle */}
            <div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  label="Cerrar"
                  size="giant"
                  isHiddenLabelOnMobile
                  icon={<XIcon size={18} />}
                  onClick={onClose}
                  className="w-full sm:w-auto text-[14px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
                />
                {canSendAssignmentToUnloading(detail.status) &&
                  onSendToUnloading && (
                    <Button
                      type="button"
                      label={isSendingToUnloading ? "Enviando..." : "Enviar a Bodega"}
                      size="giant"
                      icon={<Send size={18} />}
                      onClick={() => onSendToUnloading(detail)}
                      disabled={isSendingToUnloading}
                      className="w-full sm:w-auto text-[14px]! rounded-md! text-white! bg-alpac-primary-500! hover:bg-alpac-primary-600 dark:bg-alpac-primary-700! justify-center!"
                    />
                  )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
