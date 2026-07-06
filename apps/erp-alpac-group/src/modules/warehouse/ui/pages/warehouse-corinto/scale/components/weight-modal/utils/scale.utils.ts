
export const formatWeight = (kg: number) =>
   `${kg.toLocaleString("es-NI", { maximumFractionDigits: 0 })} kg`;

export const getTrailerPlate = (licensePlate: string) => {
   const suffix = licensePlate.replace(/\s/g, "").slice(-3).toUpperCase();
   return `R-${suffix}-XZ`;
};