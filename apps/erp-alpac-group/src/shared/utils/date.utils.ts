import type { DatePickerValue } from "@alpac/design-system";
import dayjs from "dayjs";

/** Convierte Dayjs, Date, ISO string u otro valor a `yyyy-MM-dd` para el API. */
export function toDateOnly(value: unknown): string {
   if (!value) return "";
   const date = dayjs(value as dayjs.ConfigType);
   return date.isValid() ? date.format("YYYY-MM-DD") : "";
}

/**
 * Obtener objeto de mes y año por separado
 * @param {DatePickerValue} date 
 * @returns {{ year:number, month: number }}
 */
export const toYearMonthObject = (date?: DatePickerValue) => {

   if (!date) return { year: undefined, month: undefined };

   const parsed = dayjs.isDayjs(date) ? date : dayjs(date);
   if (!parsed.isValid()) return { year: undefined, month: undefined };

   return {
      year: parsed.year(),
      month: parsed.month() + 1,
   };
};