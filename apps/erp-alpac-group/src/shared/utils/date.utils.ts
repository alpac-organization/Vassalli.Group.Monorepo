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
/**
 * Formatea una fecha y hora a un texto legible en español.
 * @param date - Fecha en formato YYYY-MM-DD
 * @param time - Hora en formato HH:mm:ss
 * @returns string - Fecha y hora formateadas, por ejemplo: "Lunes, 28/10/2026 02:30:00 pm"
 */
export const formatSpanishDateTime = (
  date?: string | null,
  time?: string | null,
): string => {
  if (!date && !time) return "";

  let datePart = "";
  if (date) {
    const parts = date.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const parsedDate = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day), 12, 0, 0),
      );
      const weekday = parsedDate.toLocaleDateString("es-NI", {
        weekday: "long",
        timeZone: "UTC",
      });
      datePart = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    } else {
      datePart = date;
    }
  }

  let timePart = "";
  if (time?.trim()) {
    const [hours, minutes, secondsRaw = "00"] = time.split(":");
    const hourNumber = Number(hours);
    const minuteNumber = Number(minutes);
    const seconds = (secondsRaw || "00").split(".")[0] || "00";
    const secondNumber = Number(seconds);
    if (!Number.isNaN(hourNumber) && !Number.isNaN(minuteNumber)) {
      const period = hourNumber >= 12 ? "pm" : "am";
      const normalizedHour = hourNumber % 12 || 12;
      timePart = `${String(normalizedHour).padStart(2, "0")}:${String(minuteNumber).padStart(2, "0")}:${String(Number.isNaN(secondNumber) ? 0 : secondNumber).padStart(2, "0")} ${period}`;
    } else {
      timePart = time;
    }
  }

  return [datePart, timePart].filter(Boolean).join(" ");
};
