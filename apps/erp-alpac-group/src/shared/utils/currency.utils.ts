export const formatCurrency = (
  value: number,
  currency = "NIO",
  minimumFractionDigits = 2,
) => {
  const numAmount =
    typeof value === "string" ? Number.parseFloat(value) : value;

  return new Intl.NumberFormat(currency === "NIO" ? "es-NI" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
  }).format(numAmount);
};
