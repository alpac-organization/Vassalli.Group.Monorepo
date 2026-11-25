import { toOptionalNumber } from "@app/shared/utils/globals.utils";

export const MAX_STOCK_LEVEL = 99999.99;

const STOCK_NUMBER_FORMATTER = new Intl.NumberFormat("es-NI", {
   minimumFractionDigits: 0,
   maximumFractionDigits: 2,
});

const TWO_DECIMAL_PATTERN = /^-?\d+(?:[.,]\d{1,2})?$/;

const normalizeNumericString = (value: unknown): string => {
   if (value === null || value === undefined) return "";
   return String(value).trim();
};

export const parseStockInput = (value: unknown): number | undefined => {
   const raw = normalizeNumericString(value);
   if (!raw) return undefined;

   const normalized = raw.replace(",", ".");
   return toOptionalNumber(normalized);
};

export const hasValidStockDecimals = (value: unknown): boolean => {
   const raw = normalizeNumericString(value);
   if (!raw) return true;
   return TWO_DECIMAL_PATTERN.test(raw);
};

export const validateMinimumStock = (value: unknown): true | string => {
   const raw = normalizeNumericString(value);
   if (!raw) {
      return "El stock mínimo es obligatorio.";
   }

   const parsed = parseStockInput(raw);
   if (parsed === undefined || Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      return "Ingrese un número válido.";
   }

   if (parsed < 0) {
      return "El stock mínimo no puede ser menor a 0.";
   }

   if (!hasValidStockDecimals(raw)) {
      return "El stock mínimo solo permite hasta 2 decimales.";
   }

   if (parsed > MAX_STOCK_LEVEL) {
      return `El stock mínimo no puede exceder ${STOCK_NUMBER_FORMATTER.format(MAX_STOCK_LEVEL)}.`;
   }

   return true;
};

export interface ValidateMaximumStockParams {
   value: unknown;
   minimumStockInput: unknown;
   currentMinimumStock: number;
   currentMaximumStock?: number | null;
}

export const validateMaximumStock = ({
   value,
   minimumStockInput,
   currentMinimumStock,
   currentMaximumStock,
}: ValidateMaximumStockParams): true | string => {
   const raw = normalizeNumericString(value);
   const parsedMin = parseStockInput(minimumStockInput);
   const effectiveMin =
      parsedMin !== undefined && !Number.isNaN(parsedMin) && parsedMin >= 0
         ? parsedMin
         : currentMinimumStock;

   if (!raw) {
      const existingMax =
         currentMaximumStock && currentMaximumStock > 0
            ? currentMaximumStock
            : undefined;

      if (existingMax !== undefined && existingMax <= effectiveMin) {
         return "El stock máximo actual es menor o igual al nuevo stock mínimo; ingresa un nuevo stock máximo.";
      }

      return true;
   }

   const parsedMax = parseStockInput(raw);
   if (parsedMax === undefined || Number.isNaN(parsedMax) || !Number.isFinite(parsedMax)) {
      return "Ingrese un número válido.";
   }

   if (parsedMax <= 0) {
      return "El stock máximo debe ser mayor a 0.";
   }

   if (!hasValidStockDecimals(raw)) {
      return "El stock máximo solo permite hasta 2 decimales.";
   }

   if (parsedMax > MAX_STOCK_LEVEL) {
      return `El stock máximo no puede exceder ${STOCK_NUMBER_FORMATTER.format(MAX_STOCK_LEVEL)}.`;
   }

   if (parsedMax <= effectiveMin) {
      return "El stock máximo debe ser mayor al stock mínimo.";
   }

   return true;
};
