import { Badges, ContextMenu } from "@alpac/design-system";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import { formatSpanishDateTime } from "@app/shared/utils/date.utils";

import { KardexType } from "@app/core/enums/kardex-type.enum";
import {
   KardexMovementType,
   type KardexMovementTypeEnum,
} from "@app/core/enums/kardex-movement-type.enum";
import {
   ReferenceType,
   resolveReferenceTypeMeta,
} from "@app/core/enums/reference-type.enum";
import { contextMenuButton } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-table/constants/supplier-table.constants";

import type { ContextMenuItem, TableColumn } from "@alpac/design-system";
import type {
   KardexMovementFilters,
   KardexMovementsColumnsProps,
} from "./kardex-movements.types";
import type { KardexMovementsData } from "@app/modules/Inventory/domain/api-contract/responses/kardex-movements.response";

export const KardexMovementTypeColorBadges: Record<KardexMovementTypeEnum, string> = {
   Buys: "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
   Exit: "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
   Returns:
      "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
};

const NUMERIC_CELL_CLASS = "whitespace-nowrap tabular-nums";

const formatKardexUnits = (value?: number | null): string => {
   if (value === null || value === undefined) return "";
   return value.toLocaleString("es-NI", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
   });
};

export const resolveKardexMovementDateTime = (
   item: Pick<
      KardexMovementsData,
      "transaction_date" | "transaction_time" | "created_at"
   >,
): string => {
   const datePart =
      item.transaction_date?.trim() ||
      (item.created_at ? item.created_at.slice(0, 10) : "");

   const rawTransactionTime = item.transaction_time?.trim() ?? "";
   const hasNonZeroTime =
      Boolean(rawTransactionTime) &&
      !/^00:00(:00(\.0+)?)?$/.test(rawTransactionTime);

   const timePart = hasNonZeroTime
      ? rawTransactionTime
      : item.created_at && item.created_at.length >= 19
        ? item.created_at.slice(11, 19)
        : rawTransactionTime;

   return formatSpanishDateTime(datePart, timePart) || "—";
};

const resolveDocumentTag = (item: KardexMovementsData) => {
   const refMeta =
      resolveReferenceTypeMeta(item.reference_type) ??
      (item.movement_type === "Buys"
         ? ReferenceType.FT
         : item.output_request_type === "Fuel"
           ? ReferenceType.BL
           : item.output_request_type === "Supply"
             ? ReferenceType.RQ
             : null);

   if (!refMeta) return null;

   const prefix =
      refMeta.value === ReferenceType.FT.value
         ? "FT#"
         : refMeta.value === ReferenceType.BL.value
           ? "BL#"
           : refMeta.value === ReferenceType.RQ.value
             ? "RQ#"
             : refMeta.shortLabel;

   const rawDocCode =
      refMeta.value === ReferenceType.FT.value
         ? item.purchase_request_code
         : refMeta.value === ReferenceType.BL.value ||
             refMeta.value === ReferenceType.RQ.value
           ? item.output_request_code
           : null;

   const normalizedCode = rawDocCode?.trim()
      ? rawDocCode.trim().toUpperCase()
      : null;

   const codeTag = normalizedCode ? `${prefix} ${normalizedCode}` : prefix;

   return {
      codeTag,
      title: normalizedCode ? `${refMeta.label}: ${normalizedCode}` : refMeta.label,
      badgeColor: refMeta.badgeColor,
   };
};

const resolveRecordNumber = (item: KardexMovementsData): string | null => {
   const raw =
      item.movement_type === "Buys"
         ? item.inventory_entry_code
         : item.inventory_output_code || item.output_request_code;

   return raw?.trim() ? raw.trim().toUpperCase() : null;
};

export const getKardexMovementsColumnsToTable = function (
   props: KardexMovementsColumnsProps,
): TableColumn<KardexMovementsData>[] {
   const { onViewDetail } = props;

   return [
      {
         key: "product_code",
         label: "Código de Producto",
         render(item) {
            return (
               <span className="whitespace-nowrap font-medium">
                  {item.product_information?.product_code?.toUpperCase() ?? "—"}
               </span>
            );
         },
      },
      {
         key: "product_name",
         label: "Producto",
         render(item) {
            return (
               <span className="font-medium">
                  {item.product_information?.product_name ?? "—"}
               </span>
            );
         },
      },
      {
         key: "movement_type",
         label: "Concepto",
         render(item) {
            return (
               <Badges
                  color="info"
                  className={KardexMovementTypeColorBadges[item.movement_type]}
                  label={
                     KardexMovementType[item.movement_type]?.label ??
                     item.movement_type
                  }
               />
            );
         },
      },
      {
         key: "transaction_datetime",
         label: "Fecha",
         render(item) {
            return (
               <span className="whitespace-nowrap text-sm">
                  {resolveKardexMovementDateTime(item)}
               </span>
            );
         },
      },
      {
         key: "record_number",
         label: "No. Registro",
         render(item) {
            const recordNumber = resolveRecordNumber(item);
            if (!recordNumber) {
               return <span className="text-slate-400">—</span>;
            }
            return (
               <span className="whitespace-nowrap font-medium">
                  {recordNumber}
               </span>
            );
         },
      },
      {
         key: "reference_type",
         label: "Documento",
         render(item) {
            const doc = resolveDocumentTag(item);
            if (!doc) {
               return <span className="text-slate-400">—</span>;
            }
            return (
               <span title={doc.title} className="inline-flex">
                  <Badges
                     color="info"
                     className={doc.badgeColor}
                     label={doc.codeTag}
                  />
               </span>
            );
         },
      },
      {
         key: "entry_units",
         label: "Entrada",
         render(item) {
            if (item.movement_type === "Exit") {
               return <span className="text-slate-400" />;
            }
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatKardexUnits(item.units)}
               </span>
            );
         },
      },
      {
         key: "exit_units",
         label: "Salida",
         render(item) {
            if (item.movement_type !== "Exit") {
               return <span className="text-slate-400" />;
            }
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatKardexUnits(item.units)}
               </span>
            );
         },
      },
      {
         key: "unit_cost",
         label: "Costo Unitario C$",
         render(item) {
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatCurrency(item.unit_cost)}
               </span>
            );
         },
      },
      {
         key: "total_input",
         label: "Total Entrada C$",
         render(item) {
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatCurrency(item.total_input)}
               </span>
            );
         },
      },
      {
         key: "total_output",
         label: "Total Salida C$",
         render(item) {
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatCurrency(item.total_output)}
               </span>
            );
         },
      },
      {
         key: "total_units",
         label: "Saldo de Unidades",
         render(item) {
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatKardexUnits(item.total_units)}
               </span>
            );
         },
      },
      {
         key: "average_cost",
         label: "Costo Promedio C$",
         render(item) {
            return (
               <span className={NUMERIC_CELL_CLASS}>
                  {formatCurrency(item.average_cost)}
               </span>
            );
         },
      },
      {
         key: "total_kardex",
         label: "Saldo Kardex C$",
         render(item) {
            return (
               <span className={`${NUMERIC_CELL_CLASS} font-semibold`}>
                  {formatCurrency(item.total_kardex)}
               </span>
            );
         },
      },
      {
         key: "options",
         label: "Opciones",
         render(item) {
            return (
               <ContextMenu
                  triggerClassName={contextMenuButton}
                  items={getContextMenuItems(item, onViewDetail)}
                  openUpOnMobile
               />
            );
         },
      },
   ];
};

const getContextMenuItems = function (
   item: KardexMovementsData,
   onViewDetail: (movement: KardexMovementsData) => void,
): ContextMenuItem[] {
   return [
      {
         label: "Ver detalle del movimiento",
         onClick() {
            onViewDetail(item);
         },
      },
   ];
};

export const getMovementTypeOptions = function () {
   return Object.entries(KardexMovementType).map(([key, value]) => ({
      label: value.label,
      value: key,
   }));
};

export const getKardexTypeOptions = function () {
   return Object.entries(KardexType).map(([key, value]) => ({
      label: value.label,
      value: key,
   }));
};

export const getReferenceTypeOptions = function () {
   return Object.entries(ReferenceType)
      .filter(([key]) => key !== "None")
      .map(([key, value]) => ({
         label: value.label,
         value: key,
      }));
};

export const DEFAULT_KARDEX_MOVEMENT_FILTERS: KardexMovementFilters = {
   branch_id: "",
   cost_center_id: "",
   product_code: "",
   category_id: "",
   kardex_type: null,
   reference_type: null,
   movement_type: null,
   date_from: null,
   date_to: null,
   page_number: 1,
   page_size: 10,
};
