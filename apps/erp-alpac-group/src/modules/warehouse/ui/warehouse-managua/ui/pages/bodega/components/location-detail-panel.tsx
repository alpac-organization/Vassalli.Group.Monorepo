import { useState } from "react";
import {
  X,
  Boxes,
  Layers,
  Target,
  Check,
  Copy,
  FileText,
  Truck,
  Package,
  QrCode,
  Barcode,
  Calendar,
  User,
  Building2,
} from "lucide-react";
import { useBodegaViewerStore } from "../stores/use-bodega-viewer-store";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import {
  resolveRackStatus,
  RACK_STATUS_COLORS,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import type { ProcessedPosition3D } from "../types/warehouse-3d.types";
import { useNavigate } from "react-router-dom";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";

function CopyButton({ text, label }: { text?: string | null; label?: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label ?? "Copiar al portapapeles"}
      className="inline-flex items-center gap-1 rounded bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300 transition cursor-pointer"
    >
      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      <span>{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "N/D";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("es-NI", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function getPoStatusBadge(status?: number | string | null) {
  if (status === null || status === undefined) return null;
  const numStatus = Number(status);
  switch (numStatus) {
    case 1:
      return { label: "Pendiente", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
    case 2:
      return { label: "En Proceso", bg: "bg-sky-500/20 text-sky-300 border-sky-500/30" };
    case 3:
      return { label: "Completado", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    case 4:
      return { label: "Cancelado", bg: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
    default:
      return { label: `Estado ${status}`, bg: "bg-slate-700 text-slate-200 border-slate-600" };
  }
}

function getDisplayText(value: unknown, fallback = "N/D"): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return fallback;
}

function PositionDetailPanel({
  position,
  onClose,
}: {
  position: ProcessedPosition3D;
  onClose: () => void;
}) {
  const { companyId, moduleCode } = useUserStore();
  const selectedBodegaId = useBodegaViewerStore((s) => s.selectedBodegaId);
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();
  const [activeTab, setActiveTab] = useState<
    "po" | "reception" | "merchandise" | "codes" | "remaining"
  >("merchandise");
  const [selectedImageModal, setSelectedImageModal] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const { GetPositionDetail } = useWarehouseAssignment({
    payloadPositionDetail:
      companyId && moduleCode && position.positionId
        ? {
            company_id: companyId,
            module_code: moduleCode,
            position_id: position.positionId,
          }
        : null,
  });

  const resolvedStatus = resolveRackStatus(position.status);
  const statusKey = (resolvedStatus?.textValue ?? "Available") as keyof typeof RACK_STATUS_COLORS;
  const statusColor = RACK_STATUS_COLORS[statusKey] ?? "#4ade80";
  const statusLabel = resolvedStatus?.label ?? getDisplayText(position.status, "Disponible");
  const positionDetailError = GetPositionDetail.error;

  const detail = GetPositionDetail.data;
  const opOrder = detail?.operationalOrderDetail ?? detail?.operational_order_detail;
  const merchInfo = detail?.merchandiseInformation ?? detail?.merchandise_information;
  const remainingPositions = detail?.remainingPositions ?? detail?.remaining_positions ?? [];
  const codeQr = detail?.codeQr ?? detail?.code_qr;
  const codeBar = detail?.codeBar ?? detail?.code_bar;
  const qrCode = detail?.qrCode ?? detail?.qr_code;
  const barCode = detail?.barCode ?? detail?.bar_code;

  const hasAssignment = Boolean(opOrder || merchInfo || codeQr || codeBar);

  const handleAssignPosition = () => {
    if (selectedBodegaId) {
      navigate(
        `${baseUrl}/warehouse-mga/bodegas/${selectedBodegaId}/asignacion?position_id=${position.positionId}&position_code=${encodeURIComponent(position.positionCode)}&structure_type=${position.structureType}`,
      );
    }
  };

  return (
    <aside className="absolute inset-y-3 right-3 z-40 w-[min(440px,calc(100%-1.5rem))] overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/98 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl flex flex-col">
      {/* Panel Header */}
      <div className="flex flex-col gap-2.5 p-4 border-b border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            Detalle de Posición
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Cerrar detalle"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex items-start justify-between gap-2 mt-1">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="m-0 text-xl font-black text-white flex items-center gap-1.5 truncate">
                <Target size={20} className="text-cyan-400 shrink-0" />
                <span className="truncate">{position.positionCode}</span>
              </h3>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  backgroundColor: `${statusColor}25`,
                  color: statusColor,
                  border: `1px solid ${statusColor}50`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: statusColor }}
                />
                {statusLabel}
              </span>
            </div>
            <p className="m-0 text-xs text-slate-400 flex items-center gap-2 mt-1">
              <span>{position.structureType === "rack" ? "Rack" : "Tramo"}: <b className="text-slate-200">{position.blockCode}</b></span>
              <span>·</span>
              <span>Sección: <b className="text-slate-200">{position.sectionCode || "General"}</b></span>
              {position.structureType === "rack" && (
                <>
                  <span>·</span>
                  <span>Nivel: <b className="text-cyan-400">N{position.level}</b></span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Coordenadas 3D */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80 mt-1">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">X (Mundo)</span>
            <span className="font-mono font-bold text-slate-200">{position.worldX.toFixed(2)}m</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Y (Altura)</span>
            <span className="font-mono font-bold text-slate-200">{position.worldY.toFixed(2)}m</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Z (Mundo)</span>
            <span className="font-mono font-bold text-slate-200">{position.worldZ.toFixed(2)}m</span>
          </div>
        </div>
      </div>

      {/* Contenido según estado de carga y asignación */}
      {GetPositionDetail.isLoading ? (
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[220px]">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <span className="text-xs text-slate-300 font-semibold">
            Consultando información y asignación de la posición...
          </span>
        </div>
      ) : positionDetailError ? (
        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-full bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-rose-400">
            <Boxes size={24} />
          </div>
          <div>
            <h4 className="m-0 text-sm font-bold text-white">
              No se pudo consultar el detalle
            </h4>
            <p className="m-0 text-xs text-slate-400 mt-1 max-w-xs">
              {getDisplayText(
                positionDetailError.error?.description,
                "La posición no tiene información de mercancía disponible.",
              )}
            </p>
          </div>
        </div>
      ) : !hasAssignment ? (
        <div className="p-6 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
            <Boxes size={24} />
          </div>
          <div>
            <h4 className="m-0 text-sm font-bold text-white">Posición sin Asignación Activa</h4>
            <p className="m-0 text-xs text-slate-400 mt-1 max-w-xs">
              Esta posición no cuenta actualmente con mercadería asignada ni orden operativa (PO) vinculada.
            </p>
          </div>

          {position.isAvailable ? (
            <button
              type="button"
              onClick={handleAssignPosition}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-lg shadow-cyan-950/60 cursor-pointer transition transform active:scale-98"
            >
              <PackagePlus size={15} />
              <span>Asignar Mercadería a esta Posición</span>
            </button>
          ) : (
            <div className="w-full mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              Posición no disponible para asignación ({statusLabel}).
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Navegación por pestañas */}
          <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/90 text-[11px] px-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("po")}
              className={`flex min-w-0 items-center justify-center gap-1 px-1.5 py-2.5 font-bold border-b-2 transition cursor-pointer ${
                activeTab === "po"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText size={13} />
              <span className="truncate">Orden (PO)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reception")}
              className={`flex min-w-0 items-center justify-center gap-1 px-1.5 py-2.5 font-bold border-b-2 transition cursor-pointer ${
                activeTab === "reception"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Truck size={13} />
              <span className="truncate">Recepción</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("merchandise")}
              className={`flex min-w-0 items-center justify-center gap-1 px-1.5 py-2.5 font-bold border-b-2 transition cursor-pointer ${
                activeTab === "merchandise"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Package size={13} />
              <span className="truncate">Mercancía</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("codes")}
              className={`flex min-w-0 items-center justify-center gap-1 px-1.5 py-2.5 font-bold border-b-2 transition cursor-pointer ${
                activeTab === "codes"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <QrCode size={13} />
              <span className="truncate">Códigos</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("remaining")}
              className={`flex min-w-0 items-center justify-center gap-1 px-1.5 py-2.5 font-bold border-b-2 transition cursor-pointer ${
                activeTab === "remaining"
                  ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers size={13} />
              <span className="truncate">Otras ({remainingPositions.length})</span>
            </button>
          </div>

          {/* Cuerpo de pestañas */}
          <div className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === "po" && (
              <div className="space-y-3.5 p-4 text-xs">
                {opOrder ? (
                  <>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Código PO</span>
                        <span className="text-base font-black text-cyan-400 font-mono flex items-center gap-2">
                          {opOrder.poCode ?? opOrder.po_code ?? "N/D"}
                          <CopyButton text={opOrder.poCode ?? opOrder.po_code} />
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {(() => {
                          const poStatus = getPoStatusBadge(opOrder.status);
                          return poStatus ? (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${poStatus.bg}`}>
                              {poStatus.label}
                            </span>
                          ) : null;
                        })()}
                        <div className="flex items-center gap-1">
                          {(opOrder.isAlerted ?? opOrder.is_alerted) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Alerta
                            </span>
                          )}
                          {(opOrder.isConsolidated ?? opOrder.is_consolidated) && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              Consolidado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 text-[10px] block">No. Documento</span>
                        <span className="font-semibold text-slate-200">{opOrder.documentNumber ?? opOrder.document_number ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">No. Póliza</span>
                        <span className="font-semibold text-slate-200">{opOrder.policyNumber ?? opOrder.policy_number ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Naviera</span>
                        <span className="font-semibold text-slate-200">{opOrder.shippingCompany ?? opOrder.shipping_company ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Consignatario</span>
                        <span className="font-semibold text-slate-200">{opOrder.consignee ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Remitente</span>
                        <span className="font-semibold text-slate-200">{opOrder.sender ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Peso / Bultos</span>
                        <span className="font-semibold text-slate-200">
                          {opOrder.weight != null ? `${opOrder.weight} kg` : "N/D"} · {opOrder.packagesCount ?? opOrder.packages_count ?? 0} bultos
                        </span>
                      </div>
                    </div>

                    {opOrder.description && (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block mb-1">Descripción de la Orden</span>
                        <p className="m-0 text-slate-300 text-xs leading-relaxed">{opOrder.description}</p>
                      </div>
                    )}

                    {(() => {
                      const cust = opOrder.customerInformation ?? opOrder.customer_information;
                      if (!cust) return null;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                          <div className="flex items-center gap-1.5 mb-2 text-cyan-400 font-bold text-xs">
                            <User size={14} />
                            <span>Información del Cliente</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 text-[10px] block">Nombre</span>
                              <span className="font-semibold text-slate-200">{cust.fullName ?? cust.full_name ?? "N/D"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">Identificación</span>
                              <span className="font-semibold text-slate-200">{cust.identification ?? "N/D"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">Teléfono</span>
                              <span className="font-semibold text-slate-200">{cust.phone ?? "N/D"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px] block">Correo</span>
                              <span className="font-semibold text-slate-200 truncate block">{cust.email ?? "N/D"}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const cc = opOrder.costCenterInformation ?? opOrder.cost_center_information;
                      if (!cc) return null;
                      return (
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                          <div className="flex items-center gap-1.5 mb-2 text-sky-400 font-bold text-xs">
                            <Building2 size={14} />
                            <span>Centro de Costos</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-cyan-400 font-bold">{cc.code ?? "N/D"}</span>
                            <span className="text-slate-200 font-semibold">{cc.name ?? "N/D"}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                    No se encontró detalle de Orden Operativa.
                  </div>
                )}
              </div>
            )}

            {activeTab === "reception" && (
              <div className="space-y-3.5 p-4 text-xs">
                {(() => {
                  const rec = opOrder?.receptionEntranceInformation ?? opOrder?.reception_entrance_information;
                  if (!rec) {
                    return (
                      <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                        No hay información de recepción asociada a esta posición.
                      </div>
                    );
                  }
                  return (
                    <>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Código de Recepción</span>
                          <span className="text-base font-black text-amber-400 font-mono flex items-center gap-2">
                            {rec.receptionCode ?? rec.reception_code ?? "N/D"}
                            <CopyButton text={rec.receptionCode ?? rec.reception_code} />
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Fecha de Ingreso</span>
                          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                            <Calendar size={12} className="text-amber-400" />
                            {formatDate(rec.createdAt ?? rec.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                        <div>
                          <span className="text-slate-500 text-[10px] block">No. Contenedor</span>
                          <span className="font-mono font-bold text-slate-200">{rec.containerNumber ?? rec.container_number ?? "N/D"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">No. Marchamo / Sello</span>
                          <span className="font-mono font-bold text-slate-200">{rec.sealNumber ?? rec.seal_number ?? "N/D"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Placa del Vehículo</span>
                          <span className="font-semibold text-slate-200">{rec.vehiclePlateNumber ?? rec.vehicle_plate_number ?? "N/D"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">País de Origen</span>
                          <span className="font-semibold text-slate-200">{rec.countryOfOrigin ?? rec.country_of_origin ?? "N/D"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Salida Vehículo</span>
                          <span className="font-semibold text-slate-200">{rec.vehicleExitTime ?? rec.vehicle_exit_time ?? "N/D"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block">Salida Contenedor</span>
                          <span className="font-semibold text-slate-200">{rec.containerExitTime ?? rec.container_exit_time ?? "N/D"}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {activeTab === "merchandise" && (
              <div className="space-y-3.5 p-4 text-xs">
                {merchInfo ? (
                  <>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Mercancía</span>
                      <h4 className="m-0 text-base font-bold text-white mt-0.5">{merchInfo.merchandise || "Sin nombre registrado"}</h4>
                      {(merchInfo.merchandiseDescription ?? merchInfo.merchandise_description) && (
                        <p className="m-0 text-slate-300 text-xs mt-1.5 leading-relaxed">
                          {merchInfo.merchandiseDescription ?? merchInfo.merchandise_description}
                        </p>
                      )}
                    </div>

                    {merchInfo.observations && (
                      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 text-[10px] block mb-1">Observaciones</span>
                        <p className="m-0 text-slate-300 text-xs leading-relaxed">{merchInfo.observations}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Tipo de Destino</span>
                        <span className="font-semibold text-slate-200">{merchInfo.destinationType ?? merchInfo.destination_type ?? "N/D"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Tipo de Mercancía</span>
                        <span className="font-semibold text-slate-200">{merchInfo.merchandiseType ?? merchInfo.merchandise_type ?? "N/D"}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                          <Boxes size={14} className="text-amber-400" />
                          <span>Polines Registrados ({merchInfo.pallets?.length ?? 0})</span>
                        </span>
                      </div>

                      {merchInfo.pallets && merchInfo.pallets.length > 0 ? (
                        <div className="space-y-2">
                          {merchInfo.pallets.map((pallet, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/70 flex items-center justify-between text-[11px]">
                              <div>
                                <span className="font-bold text-slate-200 block">
                                  {pallet.countPallets ?? pallet.count_pallets ?? 1} Polín(es)
                                </span>
                                <span className="text-slate-400 text-[10px]">
                                  Dim: {pallet.width ?? 1.1}m × {pallet.length ?? 1.2}m
                                </span>
                              </div>
                              {(pallet.bulksPerPallet ?? pallet.bulks_per_pallet) != null && (
                                <div className="text-right">
                                  <span className="text-slate-500 text-[9px] block">Bultos / Polín</span>
                                  <span className="font-semibold text-amber-300">
                                    {pallet.bulksPerPallet ?? pallet.bulks_per_pallet}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="m-0 text-slate-500 text-xs text-center py-2">
                          No hay especificaciones de polines registradas.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                    No hay datos de mercancía registrados.
                  </div>
                )}
              </div>
            )}

            {activeTab === "codes" && (
              <div className="space-y-4 p-4 text-xs">
                {/* Código QR */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                      <QrCode size={15} className="text-cyan-400" />
                      <span>Código QR</span>
                    </span>
                    <CopyButton text={qrCode} label="Copiar código QR" />
                  </div>

                  {codeQr ? (
                    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <img
                        src={codeQr}
                        alt="Código QR"
                        onClick={() => setSelectedImageModal({ url: codeQr, title: "Código QR" })}
                        className="h-40 w-40 object-contain rounded bg-white p-2 shadow cursor-pointer hover:opacity-90 transition"
                      />
                      <span className="text-[10px] text-slate-400">Clic en la imagen para ampliar</span>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-500 bg-slate-950/50 rounded-lg">
                      No hay imagen de código QR disponible
                    </div>
                  )}

                  {qrCode && (
                    <div className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800/80 font-mono text-[10px] text-slate-300 break-all">
                      <span className="text-slate-500 block text-[9px] uppercase">Contenido QR</span>
                      {qrCode}
                    </div>
                  )}
                </div>

                {/* Código de Barras */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                      <Barcode size={15} className="text-sky-400" />
                      <span>Código de Barras</span>
                    </span>
                    <CopyButton text={barCode} label="Copiar código de barras" />
                  </div>

                  {codeBar ? (
                    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <img
                        src={codeBar}
                        alt="Código de Barras"
                        onClick={() => setSelectedImageModal({ url: codeBar, title: "Código de Barras" })}
                        className="h-24 max-w-full object-contain rounded bg-white p-2 shadow cursor-pointer hover:opacity-90 transition"
                      />
                      <span className="text-[10px] text-slate-400">Clic en la imagen para ampliar</span>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-500 bg-slate-950/50 rounded-lg">
                      No hay imagen de código de barras disponible
                    </div>
                  )}

                  {barCode && (
                    <div className="mt-2 p-2 rounded bg-slate-950/80 border border-slate-800/80 font-mono text-[10px] text-slate-300 break-all">
                      <span className="text-slate-500 block text-[9px] uppercase">Contenido Barra</span>
                      {barCode}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "remaining" && (
              <div className="space-y-3 p-4 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400">
                  <span className="text-[11px]">
                    Otras posiciones de esta asignación: <b className="text-white">{remainingPositions.length}</b>
                  </span>
                </div>

                {remainingPositions.length > 0 ? (
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {remainingPositions.map((rem, idx) => {
                      const lotPos = rem.lotPositionInformation ?? (rem as any).lot_position_information;
                      const rackPos = rem.rackPositionInformation ?? (rem as any).rack_position_information;
                      const sec = rem.sectionInformation ?? (rem as any).section_information;
                      const posCode = lotPos?.positionCode ?? lotPos?.position_code ?? rackPos?.positionCode ?? rackPos?.position_code ?? `Pos #${idx + 1}`;
                      const level = lotPos?.level ?? rackPos?.level;
                      const row = lotPos?.row;
                      const col = lotPos?.column;

                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-200 flex items-center gap-1.5">
                              <Target size={13} className="text-cyan-400" />
                              <span>{posCode}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {sec?.code ? `Sección: ${sec.code}` : ""}
                              {level != null ? ` · Nivel ${level}` : ""}
                              {row != null ? ` · Fila ${row}` : ""}
                              {col != null ? ` · Col ${col}` : ""}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                            Asignada
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                    Esta es la única posición vinculada a la asignación actual.
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal para ampliar imágenes (QR o Barras) */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="relative max-w-sm w-full bg-slate-900 rounded-2xl border border-slate-700 p-4 shadow-2xl flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
              <h4 className="m-0 text-sm font-bold text-white">{selectedImageModal.title}</h4>
              <button
                type="button"
                onClick={() => setSelectedImageModal(null)}
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <img
              src={selectedImageModal.url}
              alt={selectedImageModal.title}
              className="w-full max-h-80 object-contain rounded bg-white p-4"
            />
            <button
              type="button"
              onClick={() => setSelectedImageModal(null)}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-semibold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export function LocationDetailPanel() {
  const selectedPosition = useBodegaViewerStore((s) => s.selectedPosition);
  const clearPositionSelection = useBodegaViewerStore(
    (s) => s.clearPositionSelection,
  );

  if (selectedPosition) {
    return (
      <PositionDetailPanel
        position={selectedPosition}
        onClose={clearPositionSelection}
      />
    );
  }

  return null;
}
