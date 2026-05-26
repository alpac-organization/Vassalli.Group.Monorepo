export function formatReceiptNumber(value: number): string {
  return new Intl.NumberFormat("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCordoba(value: number): string {
  return `C$ ${formatReceiptNumber(value)}`;
}

export function formatUsd(value: number): string {
  return `US$ ${formatReceiptNumber(value)}`;
}
