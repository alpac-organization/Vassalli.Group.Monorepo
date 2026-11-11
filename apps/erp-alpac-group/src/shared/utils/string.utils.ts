import { IdentificationEnum } from "@app/core/enums/identification.enum";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Valida el nombre y apellido del usuario
 * @param fullName string
 * @returns string
 */
export const validateNameAndLastName = (fullName: string): string => {
  if (!fullName) return "Usuario";

  let result = "";
  const firstName = fullName.toLowerCase().split(" ")[0];
  const splitFullName = fullName.toLowerCase().split(" ");

  if (splitFullName.length === 1) result = firstName;

  if (splitFullName.length === 2) result = `${firstName} ${splitFullName[1]}`;

  if (splitFullName.length === 3 || splitFullName.length === 4)
    result = `${firstName} ${splitFullName[2]}`;

  if (splitFullName.length > 4) result = `${firstName} ${splitFullName[3]}`;

  return result
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
/**
 * Valida que el valor sea alfanumérico
 * @param value - Valor a validar
 * @returns True si el valor es alfanumérico, false si no
 */
export function isAlfaNumericValue(value: string): boolean {
  const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ-]+$/;
  return regex.test(value);
}

export function isNumericValueWithHyphen(value: string) {
  const regex = /^[0-9-]+$/;
  return regex.test(value);
}
export const validateIdentificationNumber = (
  value: string,
  identificationType: number,
) => {
  if (!value) return true;

  if (
    identificationType === IdentificationEnum.NATIONAL_ID.value ||
    identificationType === IdentificationEnum.RESIDENCE_ID.value
  ) {
    const regex = /^[0-9]{13}[A-Z]$/;
    const cleanValue = value.replace(/-/g, "");

    return (
      regex.test(cleanValue ?? "") ||
      "El número de identificación debe tener 14 caracteres y terminar con una letra mayúscula"
    );
  }

  if (identificationType === IdentificationEnum.PASSPORT.value) {
    return (
      value.length > 4 ||
      "El número de pasaporte debe tener al menos 5 caracteres"
    );
  }

  return true;
};

export const validateNicaraguaPhone = (phone?: string): boolean | string => {
  if (!phone) return true;
  const cleanPhone = phone.replace(/-/g, "");
  const regex = /^[2578]\d{7}$/;
  return (
    regex.test(cleanPhone) ||
    "El número de teléfono debe ser válido para Nicaragua (8 dígitos y empezar con 2, 5, 7 u 8)"
  );
};

export const validateTextNoDigits = (text?: string): boolean | string => {
  if (!text) return true;
  const regex = /^\D*$/;
  return regex.test(text) || "Este campo no debe contener números";
};

/**
 * Formatea un string a formato de cédula nicaragüense (000-000000-0000X)
 * @param identification - El número de cédula (con o sin guiones)
 * @returns La cédula formateada o el valor original si no cumple el mínimo
 */
export const formatIdentificationNumber = (identification: string): string => {
  if (!identification) return "";

  const raw = identification
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 14);

  const numbers = raw.slice(0, 13).replace(/[^0-9]/g, "");
  const letter = raw.slice(13, 14).replace(/[^A-Z]/g, "");

  const clean = numbers + letter;

  if (clean.length <= 3) return clean;
  if (clean.length <= 9) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  if (clean.length <= 13)
    return `${clean.slice(0, 3)}-${clean.slice(3, 9)}-${clean.slice(9)}`;

  return `${clean.slice(0, 3)}-${clean.slice(3, 9)}-${clean.slice(9, 13)}${clean.slice(13, 14)}`;
};

/**
 * - Convierte todo a mayúsculas.
 * - Elimina caracteres no alfanuméricos.
 * - Inserta un guión automáticamente después de los primeros 2 caracteres.
 */
export function formatCodeAduana(value: string, maxLength: number = 6): string {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const trimmed = cleaned.slice(0, maxLength);

  if (trimmed.length <= 2) {
    return trimmed;
  }

  return `${trimmed.slice(0, 2)}-${trimmed.slice(2)}`;
}
/**
 * Formatea un string a formato de Declaración Única Centroamericana (NI-26-T-00000000001).
 * Estructura: 2 letras (país) + 2 dígitos (año) + 1 letra (tipo) + 11 dígitos.
 * @param duca - cadena de texto de la DUCA (con o sin guiones)
 * @returns La DUCA formateada parcialmente según lo ingresado
 */
export const formatAmericaCentralUniqueDeclaration = (duca: string): string => {
  if (!duca) return "";

  const chars = duca.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  let country = "";
  let year = "";
  let type = "";
  let numbers = "";

  for (const char of chars) {
    if (country.length < 2) {
      if (/[A-Z]/.test(char)) country += char;
      continue;
    }

    if (year.length < 2) {
      if (/[0-9]/.test(char)) year += char;
      continue;
    }

    if (type.length < 1) {
      if (/[A-Z]/.test(char)) type += char;
      continue;
    }

    if (numbers.length < 11) {
      if (/[0-9]/.test(char)) numbers += char;
      continue;
    }

    break;
  }

  if (!year) return country;
  if (!type) return `${country}-${year}`;
  if (!numbers) return `${country}-${year}-${type}`;

  return `${country}-${year}-${type}-${numbers}`;
};

/**
 * Formatea un string a formato de cédula nicaragüense (000-000000-0000X)
 * @param identification - El número de cédula (con o sin guiones)
 * @returns La cédula formateada o el valor original si no cumple el mínimo
 */
export const formatRuc = (identification: string): string => {
  if (!identification) return "";

  const raw = identification
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 14);

  const letter = raw.slice(0, 1).replace(/[^A-Z]/g, "");
  const numbers = raw.slice(1, 14).replace(/[^0-9]/g, "");

  const clean = letter + numbers;

  if (clean.length <= 1) return clean;

  return `${clean.slice(0, 1)}${clean.slice(1)}`;
};

/**
 * Formatea un string a formato de teléfono nicaragüense (0000-0000)
 * @param phone - El número de teléfono (con o sin guiones)
 * @returns El teléfono formateado o el valor original si no cumple el mínimo
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return "";

  const raw = phone.replace(/[^0-9]/g, "").slice(0, 8);

  if (raw.length <= 4) return raw;

  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
};
/**
 * Formatea una fecha ISO a un formato legible para el usuario
 * @param dateString - Fecha en formato ISO
 * @returns Fecha formateada o "" si la fecha es inválida
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export const formatDateToSpanishWords = (dateString?: string): string => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString;

  const date = new Date(Date.UTC(year, month, day, 12, 0, 0));

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };

  return date.toLocaleDateString("es-NI", options);
};

/**
 * Valida la edad del colaborador
 * @param date - Fecha de nacimiento
 * @param minAge - Edad mínima
 * @returns True si la edad es válida, false si no
 */
export const validateAge = (
  date?: string,
  minAge: number = 16,
): boolean | string => {
  if (!date) return true;

  const [year, month, day] = date.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minAge || `El colaborador debe ser mayor de ${minAge} años`;
};

/**
 * Valida que la fecha no sea mayor a la fecha actual
 * @param date - Fecha a validar
 * @returns True si la fecha es válida, false si no
 */
export const validateToday = (date?: string): boolean | string => {
  if (!date) return true;

  const [year, month, day] = date.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate > today) return "La fecha no puede ser mayor a la fecha actual";

  return true;
};

/**
 * Valida que el correo sea válido
 * @param email - Correo a validar
 * @returns True si el correo es válido, false si no
 */
export const validateEmail = (email?: string): boolean | string => {
  if (!email) return true;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) || "Correo electrónico inválido";
};

export const validateTime = (time?: string): boolean | string => {
  if (!time) return true;

  const timeRegex = /^([01]?[0-9]|2[0-3]):00$/;

  return timeRegex.test(time) || "Formato de hora inválido. Ejemplo: 01:00";
};

/**
 * Valida que la hora sea laboral
 * @param time - Hora a validar
 * @returns True si la hora es laboral, false si no
 */
export const validateLaboralHours = (time?: string): boolean | string => {
  if (!time) return true;

  const amPmMatch = time.match(/\s?([Aa][Mm]|[Pp][Mm])$/);
  let hours: number;
  let minutes: number;

  if (amPmMatch) {
    const modifier = amPmMatch[1].toUpperCase();
    const timePart = time.replace(amPmMatch[0], "").trim();
    [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  } else {
    [hours, minutes] = time.split(":").map(Number);
  }

  const totalMinutes = hours * 60 + minutes;
  const start = 8 * 60;
  const end = 17 * 60;

  const isValid = totalMinutes >= start && totalMinutes <= end;

  return (
    isValid || "La hora laboral debe estar entre las 08:00 AM y las 05:00 PM"
  );
};

/**
 * Formatea una fecha ISO a un formato legible para el usuario
 * @param time - Fecha a formatear
 * @returns Hora formateada o cadena vacía si no hay dato o es inválido
 */
export const formatTime = (time?: string): string => {
  if (!time?.trim()) return "";

  let validatedTime = new Date(time);

  if (validatedTime.toString() === "Invalid Date") {
    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "";

    validatedTime = new Date(0, 0, 0, hours, minutes, 0);
  }

  if (isNaN(validatedTime.getTime())) return "";

  return new Intl.DateTimeFormat("es-NI", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(validatedTime);
};

export const formatTimeWithSeconds = (time?: string): string => {
  if (!time?.trim()) return "";

  let validatedTime = new Date(time);

  if (validatedTime.toString() === "Invalid Date") {
    const [hours, minutes, seconds = 0] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "";

    validatedTime = new Date(
      0,
      0,
      0,
      hours,
      minutes,
      Number.isNaN(seconds) ? 0 : seconds,
    );
  }

  if (isNaN(validatedTime.getTime())) return "";

  return new Intl.DateTimeFormat("es-NI", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(validatedTime);
};

/**
 * Formatea una duración en formato HH:MM:SS a un formato legible para el usuario
 * @param duration - Duración en formato HH:MM:SS
 * @returns Duración formateada
 */
export const formatDuration = (duration: string) => {
  if (!duration) return "";
  const [hours, minutes, seconds] = duration.split(":").map(Number);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);
  return parts.length > 0 ? parts.join(" ") : "0s";
};
/**
 * Devuelve el inicio del día (00:00:00) en formato ISO UTC a partir de una fecha en formato YYYY-MM-DD.
 * @param ymd - Fecha en formato 'YYYY-MM-DD'
 * @returns string - Fecha en formato ISO UTC del inicio del día
 */
function utcDayStartIsoFromYmd(ymd: string): string {
  return dayjs.utc(ymd, "YYYY-MM-DD").startOf("day").toISOString();
}

/**
 * Devuelve el final del día (23:59:59.999) en formato ISO UTC a partir de una fecha en formato YYYY-MM-DD.
 * @param ymd - Fecha en formato 'YYYY-MM-DD'
 * @returns string - Fecha en formato ISO UTC del final del día
 */
function utcDayEndIsoFromYmd(ymd: string): string {
  return dayjs.utc(ymd, "YYYY-MM-DD").endOf("day").toISOString();
}

/**
 * Devuelve un rango de fechas UTC en formato ISO, desde el inicio del día de la fecha inicial
 * hasta el final del día de la fecha final.
 * @param startYmd - Fecha de inicio en formato 'YYYY-MM-DD'
 * @param endYmd - Fecha de fin en formato 'YYYY-MM-DD'
 * @returns { start_date: string; end_date: string } - Objeto con las fechas en formato ISO UTC
 */
export function toUtcDayRangeIsoFromYmd(
  startYmd: string,
  endYmd: string,
): { start_date: string; end_date: string } {
  return {
    start_date: utcDayStartIsoFromYmd(startYmd),
    end_date: utcDayEndIsoFromYmd(endYmd),
  };
}

/**
 * Formatea una hora a formato HH:MM:SS solo con la hora
 * @param time - Hora a formatear
 * @returns Hora formateada o null si la hora es inválida
 */
export const formatTimeHoursOnly = (time: string | null | undefined) => {
  if (!time) return null;
  const parts = time.split(":");

  if (parts.length < 2) return null;

  const hoursTest = parseInt(parts[0], 10);

  if (isNaN(hoursTest)) return null;

  const aux = new Date(0, 0, 0, hoursTest, 0, 0);

  if (isNaN(aux.getTime())) return null;

  const hh = String(aux.getHours()).padStart(2, "0");
  const mm = "00";
  const ss = "00";

  return `${hh}:${mm}:${ss}`;
};

/**
 * Valida que el string solo contenga letras, espacios y acentos
 * @param value - String a validar
 * @returns True si el string es válido, false si no
 */
export const validateOnlyLettersWithAccentsAndDiacritics = (
  value: string,
  withSpace: boolean = false,
): boolean | string => {
  if (!value) return true;
  const regex = withSpace
    ? /^[A-Za-zñÑáéíóúÁÉÍÓÚ.\s]*$/
    : /^[A-Za-zñÑáéíóúÁÉÍÓÚ]*$/;
  return regex.test(value) || "Solo se permiten letras";
};

export const formatNumberWithDecimals = (
  value: string,
  isPercentage: boolean = false,
  maxValue: number = 100,
): string => {
  if (!value) return "";

  const cleanValue = value.replace(/[^0-9.]/g, "");

  const parts = cleanValue.split(".");

  const finalValue =
    parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleanValue;

  if (isPercentage && Number(finalValue) >= maxValue) return maxValue.toString();

  return finalValue;
};

export const formatNumber = (value: string) => {
  const number = Number(value);
  if (isNaN(number)) return "0";
  return new Intl.NumberFormat("en-US").format(number);
};
