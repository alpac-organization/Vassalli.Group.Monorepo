export function openEquipmentReportPdf(blob: Blob) {
   const url = URL.createObjectURL(blob);
   window.open(url, "_blank");
}
