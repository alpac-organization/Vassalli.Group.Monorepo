/**
 * Valida el nombre y apellido del usuario
 * @param fullName string
 * @returns string
 */
export const validateNameAndLastName = (fullName: string): string => {
   if (!fullName) return 'Usuario';

   let result = '';
   const firstName = fullName.toLowerCase().split(' ')[0];
   const splitFullName = fullName.toLowerCase().split(' ');

   if (splitFullName.length === 1) result = firstName;

   if (splitFullName.length === 2) result = `${firstName} ${splitFullName[1]}`;

   if (splitFullName.length === 3 || splitFullName.length === 4)
      result = `${firstName} ${splitFullName[2]}`;

   if (splitFullName.length > 4) result = `${firstName} ${splitFullName[3]}`;

   return result
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

/**
 * Formatea un string a formato de cédula nicaragüense (000-000000-0000X)
 * @param identification - El número de cédula (con o sin guiones)
 * @returns La cédula formateada o el valor original si no cumple el mínimo
 */
export const formatIdentificationNumber = (identification: string): string => {
   if (!identification) return '';

   const raw = identification.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14);

   const numbers = raw.slice(0, 13).replace(/[^0-9]/g, '');
   const letter = raw.slice(13, 14).replace(/[^A-Z]/g, '');

   const clean = numbers + letter;

   if (clean.length <= 3) return clean;
   if (clean.length <= 9) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
   if (clean.length <= 13) return `${clean.slice(0, 3)}-${clean.slice(3, 9)}-${clean.slice(9)}`;

   return `${clean.slice(0, 3)}-${clean.slice(3, 9)}-${clean.slice(9, 13)}${clean.slice(13, 14)}`;
};

/**
 * Formatea un string a formato de teléfono nicaragüense (0000-0000)
 * @param phone - El número de teléfono (con o sin guiones)
 * @returns El teléfono formateado o el valor original si no cumple el mínimo
 */
export const formatPhone = (phone: string): string => {
   if (!phone) return '';

   const raw = phone.replace(/[^0-9]/g, '').slice(0, 8);

   if (raw.length <= 4) return raw;

   return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
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

   const [year, month, day] = date.split('-').map(Number);
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

   const [year, month, day] = date.split('-').map(Number);
   const birthDate = new Date(year, month - 1, day);

   const today = new Date();
   today.setHours(0, 0, 0, 0);

   if (birthDate > today) return 'La fecha no puede ser mayor a la fecha actual';

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
   return emailRegex.test(email) || 'Correo electrónico inválido';
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

   if (validatedTime.toString() === 'Invalid Date') {
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