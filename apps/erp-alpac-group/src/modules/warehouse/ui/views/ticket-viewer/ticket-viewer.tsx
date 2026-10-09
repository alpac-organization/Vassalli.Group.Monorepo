import { useEffect, useState } from "react";
import { data, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Breadcrumb, Badges, Card, StatsCard, DataTable } from "@alpac/design-system";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import type { TicketParams } from "./ticket-viewer.types";
import { useWarehouseAssignment } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useAssignment";
import { Loader } from "@app/shared/components/loaders/loader";
import { Package, Warehouse, Truck, MapPin, AlertCircle, Circle, CheckCircle, FileText, Layers, Grid } from "lucide-react";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";

interface PlacementItem {
  sectionCode: string;
  sectionStorageType: string;
  isActive: boolean;
  type: "lot" | "rack";
  positionCode: string;
  row: number;
  column: number;
  level: number;
  status: string;
}

interface PlacementColumn {
  key: string;
  label: string;
  render?: (item: PlacementItem) => React.ReactNode;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  Reserved: { label: "Reservado", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
  Occupied: { label: "Ocupado", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  Available: { label: "Disponible", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  Pending: { label: "Pendiente", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
};

const STORAGE_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  Racks: { label: "Racks", icon: <Grid className="w-4 h-4" />, color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  Lots: { label: "Tramos", icon: <Layers className="w-4 h-4" />, color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300" },
};

export const TicketViewer = () => {

   const { moduleCode: modulePath = "warehouse-mga" } = useParams<TicketParams>();

   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const { baseUrl } = useBaseUrl();
   const { companyId: storeCompanyId, companyAlias, companyName, moduleCode: storeModuleCode } = useUserStore();

   const [hasHydrated, setHasHydrated] = useState(() =>
      useUserStore.persist.hasHydrated(),
   );

   useEffect(() => {
      const unsub = useUserStore.persist.onFinishHydration(() => {
         setHasHydrated(true);
      });
      setHasHydrated(useUserStore.persist.hasHydrated());
      return unsub;
   }, []);

   const code = searchParams.get("code") ?? "";
   const companyId = storeCompanyId || companyAlias;
   const moduleCode = storeModuleCode || modulePath;

   const { GetAssignmentDetailsByCode } = useWarehouseAssignment({
      payloadAssignmentDetailsByCode: {
         company_id: companyId,
         module_code: moduleCode,
         assignment_code: code,
      },
   });

  const { data: merchandiseLocation, isLoading, isError, error, refetch } = GetAssignmentDetailsByCode;

   useEffect(() => {
      if (hasHydrated && companyId && moduleCode && code) {
         refetch();
      }
   }, [hasHydrated, companyId, moduleCode, code, refetch]);

   if (!hasHydrated) {
      return (
         <section className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
         <Loader title="Cargando sesión..." />
         </section>
      );
   }

   if (!companyId || !moduleCode) {
      return (
         <section className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
            <Card className="w-full max-w-md p-6 text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Sesión incompleta</h3>
               <p className="text-red-600 dark:text-red-400">No se pudo obtener la información de la empresa. Por favor, inicie sesión nuevamente.</p>
            </Card>
         </section>
      );
   }

   if (isLoading) {
      return (
         <section className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
         <Loader title="Cargando Información..." />
         </section>
      );
   }

   if (isError) {
      return (
         <section className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
            <Card className="w-full max-w-md p-6 text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
               <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

               <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error al cargar ticket</h3>
               <p className="text-red-600 dark:text-red-400">{error?.error?.description || "No se pudo cargar la información del ticket. Verifique el código."}</p>
            </Card>
         </section>
      );
   }

   if (!merchandiseLocation) {
      return (
         <section className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
            <Card className="w-full max-w-md p-6 text-center border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
               <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Ticket no encontrado</h3>
               <p className="text-amber-600 dark:text-amber-400">No se encontró información para el código proporcionado.</p>
            </Card>
         </section>
      );
   }

   const assignmentCreatedAt = merchandiseLocation.created_at
      ? new Date(merchandiseLocation.created_at)
      : new Date();

   const assignmentDateLabel = formatDate(assignmentCreatedAt.toISOString());
   const assignmentTimeLabel = formatTime(assignmentCreatedAt.toISOString());

   const destinationTypeLabel = merchandiseLocation.destination_type ?? "—";

  const placements: PlacementItem[] = (merchandiseLocation.assignment_stock_placements_information || []).flatMap((placement) => {
    if (!placement) return [];

    const sectionInfo = placement.section_information;
    const sectionCode = sectionInfo?.code ?? "—";
    const sectionStorageType = sectionInfo?.section_storage_type ? "Lots" : "Racks";
    const isActive = sectionInfo?.is_active ?? true;
    const items: PlacementItem[] = [];

    const lotPos = placement.lot_position_information;
    if (lotPos) {
      items.push({
        sectionCode,
        sectionStorageType,
        isActive,
        type: "lot",
        positionCode: lotPos.position_code ?? "—",
        row: typeof lotPos.row === "number" ? lotPos.row : 0,
        column: typeof lotPos.column === "number" ? lotPos.column : 0,
        level: typeof lotPos.level === "number" ? lotPos.level : 0,
        status: lotPos.status?.toString() ?? "—",
      });
    }
    const rackPos = placement.rack_position_information;

    if (rackPos) {
      items.push({
        sectionCode,
        sectionStorageType,
        isActive,
        type: "rack",
        positionCode: rackPos.position_code ?? "—",
        row: typeof rackPos.row === "number" ? rackPos.row : 0,
        column: typeof rackPos.column === "number" ? rackPos.column : 0,
        level: typeof rackPos.level === "number" ? rackPos.level : 0,
        status: rackPos.status?.toString() ?? "—",
      });
    }
    return items;
  });

  const scannedAt = new Date();
  const dateLabel = scannedAt
    .toLocaleDateString("es-NI", { day: "2-digit", month: "short" })
    .replace(".", "")
    .toUpperCase();
  const timeLabel = scannedAt.toLocaleTimeString("es-NI", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const getStatusConfig = (status: string) => STATUS_CONFIG[status] || { label: status, color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" };
  const getStorageTypeConfig = (type: string) => STORAGE_TYPE_CONFIG[type] || { label: type, icon: <Grid className="w-4 h-4" />, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };

  const placementColumns: PlacementColumn[] = [
    { key: "sectionCode", label: "Sección" },
    { 
      key: "sectionStorageType", 
      label: "Tipo", 
      render: (item) => {
        const config = getStorageTypeConfig(item.sectionStorageType);
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.icon}
            {config.label}
          </span>
        );
      }
    },
    { 
      key: "isActive", 
      label: "Activa", 
      render: (item) => (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${item.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
          {item.isActive ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
        </span>
      )
    },
    { key: "positionCode", label: "Posición" },
    { key: "row", label: "Fila" },
    { key: "column", label: "Columna" },
    { key: "level", label: "Nivel" },
    { 
      key: "status", 
      label: "Estado", 
      render: (item) => {
        const config = getStatusConfig(item.status);
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
  ];

  return (
    <section className="flex min-h-[80vh] w-full flex-col items-center gap-4 p-4 md:p-8">
      <div className="w-full max-w-5xl">

         <div className="mb-5">
            <Breadcrumb
               items={[
                  { label: "Dashboard", url: baseUrl, onClick: (url) => navigate(url) },
                  { label: "Almacén", url: `${baseUrl}/${modulePath}/access-control`, onClick: (url) => navigate(url) },
                  { label: "Ticket", url: `${baseUrl}/${modulePath}/ticket` },
               ]}
            />
         </div>

         <Card className="w-full mb-4">
            <div className="p-6">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                     <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Ticket de Asignación</h1>
                     <p className="text-sm text-slate-500 dark:text-slate-400">Vista previa de asignación operativa</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {dateLabel}</span>
                  <span className="flex items-center gap-1"><Circle className="w-4 h-4" /> {timeLabel}</span>
               </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <DetailField label="Empresa" value={companyName ?? companyAlias ?? "—"} icon={<Warehouse className="w-4 h-4" />} />
               <DetailField label="Código Ticket" value={code ?? "—"} icon={<Truck className="w-4 h-4" />} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
               <DetailField 
                  label="Tipo de Destino" 
                  value={destinationTypeLabel} 
                  icon={<MapPin className="w-4 h-4" />}
               />
               <DetailField 
                  label="Mercancía" 
                  value={merchandiseLocation.merchandise ?? "—"} 
                  icon={<Package className="w-4 h-4" />}
               />
               <DetailField 
                  label="Fecha Asignación" 
                  value={`${assignmentDateLabel} · ${assignmentTimeLabel}`} 
                  icon={<Circle className="w-4 h-4" />}
               />
               </div>

               {merchandiseLocation.merchandise_description && (
               <DetailField 
                  label="Descripción Mercancía" 
                  value={merchandiseLocation.merchandise_description} 
                  icon={<Package className="w-4 h-4" />}
               />
               )}

               {/* Warehouse Info */}
               {merchandiseLocation.warehouse_information && (
               <Card className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">
                     <Warehouse className="w-4 h-4" />
                     <span>Información de Bodega</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <DetailField label="Código" value={merchandiseLocation.warehouse_information.code ?? "—"} />
                     <DetailField label="Tipo" value={merchandiseLocation.warehouse_information.warehouse_type?.toString() ?? "—"} />
                  </div>
               </Card>
               )}

               {/* Operational Order Info */}

               {
                  merchandiseLocation.operational_order_information && (
                     <Card className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-3">
                           <FileText className="w-4 h-4" />
                           <span>Orden Operativa {merchandiseLocation.operational_order_information.is_alerted && <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">⚠ Alerta</span>}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           <DetailField label="Código PO" value={merchandiseLocation.operational_order_information.po_code ?? "—"} />
                           <DetailField label="Bultos Totales" value={merchandiseLocation.operational_order_information.packages_count?.toString() ?? "—"} />
                        </div>
                     </Card>
                  )
               }

               {/* Placements Table */}

               {
                  placements.length > 0 && (
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                           <MapPin className="w-4 h-4" />
                           <span>Ubicaciones Asignadas ({placements.length})</span>
                        </div>

                        <DataTable<PlacementItem>
                           title="Ubicación de la mercaderia"
                           data={placements}
                           columns={placementColumns}
                           minHeight={300}
                           maxHeight={400}
                        />
                     </div>
                  )
               }

            </div>
         </Card>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
               Escaneado el {dateLabel} a las {timeLabel} · Módulo: {modulePath}
            </p>
         </div>
      </section>
  );
};