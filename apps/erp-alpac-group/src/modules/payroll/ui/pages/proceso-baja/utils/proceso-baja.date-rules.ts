import { formatDate } from "@app/shared/utils/string.utils";
import dayjs from "dayjs";

export const MAX_RESIGNATION_NOTICE_DAYS = 15;

const parseDate = (value?: string | null) => {
  if (!value?.trim()) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const toDateOnlyValue = (value?: string | null) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value?.trim() ?? "");
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
};

const todayUtcDateOnly = () => {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}-${day}`;
};

/** Misma suma que `DateOnly.AddDays`: días de calendario, sin hora ni zona. */
const addCalendarDays = (dateOnly: string, days: number) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly);
  if (!match || !Number.isInteger(days)) return null;

  const utc = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]) + days),
  );
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${utc.getUTCFullYear()}-${month}-${day}`;
};

export const readNoticeDays = (value?: string | number | null) => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text) return null;
  const days = Number(text);
  return Number.isInteger(days) ? days : Number.NaN;
};

const parseNoticeDays = readNoticeDays;

const hasNoticeDaysValue = (value?: string | number | null) =>
  readNoticeDays(value) !== null;

export const noticeApplies = (type?: string | null) =>
  type === "VoluntaryResignation" || type === "UnjustifiedDismissal";

const noticeDoesNotApplyMessage = (type?: string | null) => {
  switch (type) {
    case "JustifiedDismissal":
      return "El preaviso no aplica para el despido justificado (Art. 48).";
    case "MutualAgreement":
      return "El preaviso no aplica para el mutuo acuerdo.";
    case "ContractExpiration":
      return "El preaviso no aplica para el vencimiento del contrato.";
    case "WorkCompletion":
      return "El preaviso no aplica para la conclusión de la obra o servicio.";
    case "EmployeeDeath":
      return "El preaviso no aplica para el fallecimiento del colaborador.";
    case "Retirement":
      return "El preaviso no aplica para la jubilación.";
    default:
      return "El preaviso no aplica para este tipo de terminación.";
  }
};

export const getNoticeDateHint = (type?: string | null) => {
  if (type === "VoluntaryResignation") {
    return "Art. 44: el preaviso es opcional y, si se indica, los días van de 0 a 15. Si esa suma queda en el futuro, el cierre espera hasta ese día. Para cerrarla hoy, deje el preaviso vacío o indique 0 días.";
  }

  if (type === "UnjustifiedDismissal") {
    return "Art. 45: el preaviso del empleador es opcional. Si es menor a 15 días, la liquidación paga el sustituto. Si no hay aviso, la fecha efectiva se indica al cerrar.";
  }

  if (type === "JustifiedDismissal") {
    return "Art. 48: el despido es inmediato. El preaviso no aplica y la fecha efectiva se indica al cerrar.";
  }

  if (type === "MutualAgreement") {
    return "El mutuo acuerdo no usa preaviso. Las partes fijan la fecha efectiva al cerrar.";
  }

  if (type === "ContractExpiration") {
    return "El vencimiento del contrato no usa preaviso. La fecha efectiva se indica al cerrar.";
  }

  if (type === "WorkCompletion") {
    return "La conclusión de la obra o servicio no usa preaviso. La fecha efectiva se indica al cerrar.";
  }

  if (type === "EmployeeDeath") {
    return "El fallecimiento no usa preaviso. La fecha efectiva se indica al cerrar.";
  }

  if (type === "Retirement") {
    return "La jubilación no es la renuncia del Art. 44. La fecha efectiva se indica al cerrar.";
  }

  return null;
};

export const getCloseDateHint = (type?: string | null) => {
  switch (type) {
    case "VoluntaryResignation":
    case "UnjustifiedDismissal":
      return "No se registró preaviso. Indique la fecha efectiva de egreso.";
    case "JustifiedDismissal":
      return "El despido justificado es inmediato. Indique la fecha efectiva de egreso.";
    case "MutualAgreement":
      return "Indique la fecha efectiva que fijaron las partes.";
    case "ContractExpiration":
      return "Indique la fecha en que termina el plazo del contrato.";
    case "WorkCompletion":
      return "Indique la fecha en que concluyó la obra o el servicio.";
    case "EmployeeDeath":
      return "Indique la fecha efectiva de egreso.";
    case "Retirement":
      return "Indique la fecha efectiva de la jubilación.";
    default:
      return "Indique la fecha efectiva de egreso.";
  }
};

export const getNoticeDateError = (
  type?: string | null,
  noticeDate?: string | null,
) => {
  if (type && !noticeApplies(type) && noticeDate?.trim()) {
    return noticeDoesNotApplyMessage(type);
  }

  if (!noticeDate?.trim()) return null;

  const notice = parseDate(noticeDate);
  if (!notice) return "La fecha de preaviso no es válida.";
  if (notice.isAfter(dayjs(), "day")) {
    return "La fecha de preaviso debe ser de hoy hacia atrás.";
  }

  return null;
};

export const getNoticeDaysError = (
  type?: string | null,
  noticeDate?: string | null,
  noticeDays?: string | number | null,
) => {
  if (type && !noticeApplies(type) && hasNoticeDaysValue(noticeDays)) {
    return noticeDoesNotApplyMessage(type);
  }

  if (!noticeApplies(type)) return null;

  const hasDate = Boolean(noticeDate?.trim());
  const hasDays = hasNoticeDaysValue(noticeDays);
  const days = parseNoticeDays(noticeDays);

  if (hasDays && !hasDate) {
    return "Los días de preaviso no aplican sin fecha de preaviso.";
  }

  if (hasDate && !hasDays) {
    return "Debe indicar los días de preaviso.";
  }

  if (!hasDays) return null;
  if (days === null || Number.isNaN(days)) {
    return "Los días de preaviso deben ser un número entero.";
  }
  if (days < 0) return "Los días de preaviso no pueden ser negativos.";
  if (type === "VoluntaryResignation" && days > MAX_RESIGNATION_NOTICE_DAYS) {
    return "Los días de preaviso de la renuncia deben estar entre 0 y 15.";
  }

  return null;
};

export const getEffectiveDepartureDate = (
  noticeDate?: string | null,
  noticeDays?: number | null,
) => {
  const notice = toDateOnlyValue(noticeDate);
  if (!notice || noticeDays === null || noticeDays === undefined || noticeDays < 0) {
    return null;
  }

  return addCalendarDays(notice, noticeDays);
};

export const formatEffectiveDeparture = (
  noticeDate?: string | null,
  noticeDays?: number | null,
) => {
  const effective = getEffectiveDepartureDate(noticeDate, noticeDays);
  return effective ? formatDate(effective) : null;
};

export const getCloseDepartureError = (
  noticeDate?: string | null,
  noticeDays?: number | null,
  departureDate?: string | null,
) => {
  const effective = getEffectiveDepartureDate(noticeDate, noticeDays);
  const departure = effective ?? toDateOnlyValue(departureDate);

  if (!departure) return "Debe indicar la fecha efectiva de egreso.";
  if (departure > todayUtcDateOnly()) {
    return "La baja solo se puede cerrar a partir de la fecha efectiva.";
  }

  return null;
};

export const isEffectiveDepartureInTheFuture = (
  noticeDate?: string | null,
  noticeDays?: number | null,
) => {
  const effective = getEffectiveDepartureDate(noticeDate, noticeDays);
  return Boolean(effective && effective > todayUtcDateOnly());
};

export const toEffectiveDepartureValue = (
  noticeDate?: string | null,
  noticeDays?: number | null,
) => getEffectiveDepartureDate(noticeDate, noticeDays);
