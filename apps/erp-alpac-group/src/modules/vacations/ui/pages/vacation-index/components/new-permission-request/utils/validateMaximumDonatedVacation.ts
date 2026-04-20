
export const validateMaximumDonatedVacation = (value?: string | number): boolean | string => {
   if (value === undefined || value === null || value === '') return false;
   const maxDays = 5;
   const number = Number(value);
   return number <= maxDays || `El valor debe ser menor o igual a ${maxDays}.`;
}