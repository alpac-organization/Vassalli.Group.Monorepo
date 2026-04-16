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

import { IdentificationEnum } from "@app/core/enums/identifcation.enum";

export const validateIdentificationNumber = (
   value: string,
   identificationType: number,
) => {
   if (!value) return "El número de identificación es requerido";

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

   console.log(timeRegex.test(time) || "Formato de hora inválido. Ejemplo: 01:00")

   return timeRegex.test(time) || "Formato de hora inválido. Ejemplo: 01:00";
};

/**
 * Formatea una fecha ISO a un formato legible para el usuario
 * @param date - Fecha a formatear
 * @returns Fecha formateada o "—" si la fecha es inválida
 */
export const formatDate = (date?: string): string => {
   if (!date) return "—";

   const dateOnly = date.split("T")[0];

   const d = new Date(`${dateOnly}T12:00:00`);

   if (isNaN(d.getTime())) return "—";

   return new Intl.DateTimeFormat("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
   }).format(d);
};

/**
 * Formatea una fecha y hora ISO a un formato legible para el usuario
 * @param date - Fecha a formatear
 * @returns Fecha y hora formateada o "—" si la fecha es inválida
 */
export const formatDateTime = (date?: string): string => {
   if (!date) return "—";

   const dateOnly = date.split("T")[0];

   const d = new Date(`${dateOnly}T12:00:00`);

   if (isNaN(d.getTime())) return "—";

   return new Intl.DateTimeFormat("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
   }).format(d);
};

/**
 * Formatea una fecha ISO a un formato legible para el usuario
 * @param time - Fecha a formatear
 * @returns Fecha formateada o "—" si la fecha es inválida
 */
export const formatTime = (time?: string): string => {
   if (!time) return "--:-- --";

   let validatedTime = new Date(time);

   if (validatedTime.toString() === "Invalid Date") {
      const [hours, minutes] = time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) return "--:-- --";

      validatedTime = new Date(0, 0, 0, hours, minutes, 0);
   }

   if (isNaN(validatedTime.getTime())) return "--:-- --";

   return new Intl.DateTimeFormat("es-NI", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
   }).format(validatedTime);
};

export function formatLongDate(isoDate: string | null | undefined): string {
   if (!isoDate) return "—";
   const dateOnly = isoDate.split("T")[0];
   const d = new Date(`${dateOnly}T12:00:00`);
   if (isNaN(d.getTime())) return "—";
   return new Intl.DateTimeFormat("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
   }).format(d);
}