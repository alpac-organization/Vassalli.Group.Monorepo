/**
 * Formatear un número con comas y puntos
 * @param value Valor a formatear
 * @param precision Número de digitos
 * @param decimals Número de decimales
 * @returns Valor formateado
 */
export const formatAmount = (
   value: string,
   precision: number = 15,
   decimals: number = 2,
): string => {
   if (value === '') return '';

   // Limpiar entrada: solo números y un punto
   value = value.replace(/[^0-9.]/g, '');

   const parts = value.split('.');

   if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
   }

   let [integer, decimal] = value.split('.');

   // Limpiar ceros iniciales y truncar según precisión (Entera primero)
   integer = integer.replace(/^0+(?=\d)/, '').slice(0, precision);

   const integerLength = integer.length; // Longitud real para lógica de precisión

   // Solo permitir decimales si hay espacio y la configuración lo permite
   const canHaveDecimals =
      decimal !== undefined && precision - integerLength > 0 && decimals > 0;

   if (canHaveDecimals) {
      // Truncar decimales según espacio restante de la precisión y el límite de decimales
      decimal = decimal.slice(0, Math.min(decimals, precision - integer.length));
   }

   // Formatear parte entera con separadores de miles
   if (integer) {
      integer = BigInt(integer).toLocaleString('en-US');
   }

   return canHaveDecimals ? `${integer}.${decimal}` : integer;
};

export const validateDecimalNumber = (value?: string | number): boolean | string => {
   if (value === undefined || value === null || value === '') return false;
   const number = Number(value);
   return Number.isFinite(number) || 'El valor debe ser un número válido.';
};

export const validateIntegerNumber = (value?: string | number): boolean | string => {
   if (value === undefined || value === null || value === '') return false;
   const number = Number(value);
   return Number.isInteger(number) || 'El valor debe ser un número entero.';
};

export const validatePositiveNumber = (value?: string | number, includeZero: boolean = false): boolean | string => {
   if (value === undefined || value === null || value === '') return false;
   const number = Number(value);
   return includeZero ? number >= 0 || 'El valor debe ser mayor o igual a 0.' : number > 0 || 'El valor debe ser mayor a 0.';
};
