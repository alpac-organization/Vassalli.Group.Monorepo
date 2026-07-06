
export const formatWeight = (kg: number) =>
   `${kg.toLocaleString("es-NI", { maximumFractionDigits: 0 })} kg`;