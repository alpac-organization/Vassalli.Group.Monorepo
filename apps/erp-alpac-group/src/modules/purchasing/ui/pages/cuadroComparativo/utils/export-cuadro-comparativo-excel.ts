import type {
  CuadroComparativoData,
  SupplierQuote,
} from "@app/modules/purchasing/ui/pages/cuadroComparativo/types/cuadro-comparativo.types";
import {
  fitImageInBox,
  getImageNaturalSize,
} from "@app/modules/payroll/ui/pages/nomina/components/payroll-excel/utils/fit-image-excel";
import type { Border, Cell, Worksheet } from "exceljs";

const LOGO_MAX_WIDTH = 110;
const LOGO_MAX_HEIGHT = 95;

const COL = {
  qty: 1,
  um: 2,
  desc: 3,
  s1: { marca: 4, pu: 5, iva: 6, total: 7 },
  s2: { marca: 8, pu: 9, iva: 10, total: 11 },
  s3: { marca: 12, pu: 13, iva: 14, total: 15 },
} as const;

const SUPPLIER_COLS = [COL.s1, COL.s2, COL.s3] as const;

const HEADER_FILL = "FFDDEBF7";
const BLACK: Border = { style: "thin", color: { argb: "FF000000" } };
const THIN_BORDER = { top: BLACK, left: BLACK, bottom: BLACK, right: BLACK };

const CRITERIA_ROWS: {
  label: string;
  key: keyof CuadroComparativoData["criteria"][number];
}[] = [
  { label: "6. Disponibilidad de inventario", key: "inventoryAvailability" },
  { label: "7. Forma de pago (Contado/Crédito)", key: "paymentMethod" },
  { label: "8. Calidad", key: "quality" },
  { label: "9. Plazo de entrega", key: "deliveryTime" },
  { label: "10. Transporte", key: "transport" },
  { label: "11. Periodo de garantía", key: "warrantyPeriod" },
  { label: "12. Servicios post venta", key: "afterSalesService" },
];

export type ExportCuadroComparativoExcelParams = {
  data: CuadroComparativoData;
  logoUrl?: string | null;
};

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `C$ ${value.toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatQuantity(value: number): string {
  return value.toLocaleString("es-NI", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function border(cell: Cell) {
  cell.border = THIN_BORDER;
}

function center(cell: Cell) {
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
}

function fill(cell: Cell, argb: string) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function styleHeader(cell: Cell, value: string) {
  cell.value = value;
  cell.font = { bold: true, size: 10, name: "Calibri" };
  center(cell);
  fill(cell, HEADER_FILL);
  border(cell);
}

function writeQuote(
  row: import("exceljs").Row,
  quote: SupplierQuote,
  cols: (typeof SUPPLIER_COLS)[number],
) {
  const marca = row.getCell(cols.marca);
  marca.value = quote.brand || "";
  center(marca);
  border(marca);
  marca.font = { size: 10, name: "Calibri" };

  const pu = row.getCell(cols.pu);
  pu.value = quote.unitPrice === null ? "" : formatCurrency(quote.unitPrice);
  center(pu);
  border(pu);
  pu.font = { size: 10, name: "Calibri" };

  const iva = row.getCell(cols.iva);
  iva.value =
    quote.ivaLabel ?? (quote.iva === null ? "" : formatCurrency(quote.iva));
  center(iva);
  border(iva);
  iva.font = { size: 10, name: "Calibri" };

  const total = row.getCell(cols.total);
  total.value = formatCurrency(quote.totalPrice);
  center(total);
  border(total);
  total.font = { size: 10, name: "Calibri" };
}

async function addLogo(
  wb: import("exceljs").Workbook,
  ws: Worksheet,
  logoUrl: string,
) {
  try {
    const res = await fetch(logoUrl);
    if (!res.ok) return;

    const arrayBuffer = await res.arrayBuffer();
    const extMatch = logoUrl.match(/\.(\w+)(?:\?.*)?$/);
    const rawExt = extMatch?.[1]?.toLowerCase() ?? "png";
    const extension = (rawExt === "jpg" ? "jpeg" : rawExt) as
      | "png"
      | "jpeg"
      | "gif";
    const imageId = wb.addImage({ buffer: arrayBuffer, extension });
    const naturalSize = await getImageNaturalSize(arrayBuffer);
    const logoSize = fitImageInBox(
      naturalSize.width,
      naturalSize.height,
      LOGO_MAX_WIDTH,
      LOGO_MAX_HEIGHT,
    );

    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.2 },
      ext: { width: logoSize.width, height: logoSize.height },
      editAs: "oneCell",
    });
  } catch {
    console.warn("No se pudo agregar el logo al Cuadro Comparativo");
  }
}

function downloadBlob(buffer: ArrayBuffer | BlobPart, fileName: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function exportCuadroComparativoExcel({
  data,
  logoUrl,
}: ExportCuadroComparativoExcelParams): Promise<void> {
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "ALPAC ERP";

  const ws = wb.addWorksheet("Hoja1", {
    views: [{ showGridLines: true }],
    pageSetup: {
      orientation: "landscape",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  ws.columns = [
    { width: 12 },
    { width: 12 },
    { width: 48 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 10 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
  ];

  for (let r = 1; r <= 5; r += 1) {
    ws.getRow(r).height = r <= 4 ? 18 : 14;
  }
  ws.getRow(1).height = 22;
  ws.getRow(2).height = 22;
  ws.getRow(3).height = 22;
  ws.getRow(4).height = 22;

  {
    const row = ws.getRow(6);
    row.height = 18;
    data.suppliers.forEach((supplier, index) => {
      const cols = SUPPLIER_COLS[index];
      ws.mergeCells(6, cols.marca, 6, cols.total);
      const cell = row.getCell(cols.marca);
      cell.value = supplier;
      cell.font = { bold: true, size: 11, name: "Calibri" };
      center(cell);
    });
  }

  {
    const row = ws.getRow(7);
    row.height = 20;
    styleHeader(row.getCell(COL.qty), "2. Cantidad");
    styleHeader(row.getCell(COL.um), "3. UM");
    styleHeader(row.getCell(COL.desc), "4. Descripción");

    SUPPLIER_COLS.forEach((cols) => {
      styleHeader(row.getCell(cols.marca), "Marca");
      styleHeader(row.getCell(cols.pu), "P/U");
      styleHeader(row.getCell(cols.iva), "IVA");
      styleHeader(row.getCell(cols.total), "Precio total");
    });
  }

  const firstDataRow = 8;
  data.items.forEach((item, itemIndex) => {
    const rowNum = firstDataRow + itemIndex;
    const row = ws.getRow(rowNum);
    row.height = 18;

    const qty = row.getCell(COL.qty);
    qty.value = formatQuantity(item.quantity);
    qty.font = { size: 10, name: "Calibri" };
    center(qty);
    border(qty);

    const um = row.getCell(COL.um);
    um.value = item.unit;
    um.font = { size: 10, name: "Calibri" };
    center(um);
    border(um);

    const desc = row.getCell(COL.desc);
    desc.value = item.description;
    desc.font = { size: 10, name: "Calibri" };
    desc.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
    border(desc);

    item.quotes.forEach((quote, quoteIndex) => {
      writeQuote(row, quote, SUPPLIER_COLS[quoteIndex]);
    });
  });

  const totalsStart = firstDataRow + data.items.length;
  const totalRows: {
    label: string;
    getValue: (t: CuadroComparativoData["totals"][number]) => string;
  }[] = [
    { label: "Sub total", getValue: (t) => formatCurrency(t.subtotal) },
    {
      label: "IVA",
      getValue: (t) => (t.iva === null ? "" : formatCurrency(t.iva)),
    },
    { label: "TOTAL", getValue: (t) => formatCurrency(t.total) },
  ];

  totalRows.forEach(({ label, getValue }, index) => {
    const rowNum = totalsStart + index;
    const row = ws.getRow(rowNum);
    row.height = 18;

    for (let c = 1; c <= COL.desc; c += 1) {
      border(row.getCell(c));
    }

    const labelCell = row.getCell(COL.desc);
    labelCell.value = label;
    labelCell.font = {
      bold: label === "TOTAL",
      size: 10,
      name: "Calibri",
    };
    labelCell.alignment = { horizontal: "right", vertical: "middle" };

    data.totals.forEach((total, supplierIndex) => {
      const cols = SUPPLIER_COLS[supplierIndex];
      border(row.getCell(cols.marca));
      border(row.getCell(cols.pu));
      border(row.getCell(cols.iva));

      const totalCell = row.getCell(cols.total);
      totalCell.value = getValue(total);
      totalCell.font = {
        bold: label === "TOTAL",
        size: 10,
        name: "Calibri",
      };
      center(totalCell);
      border(totalCell);
    });
  });

  const criteriaHeaderRow = totalsStart + totalRows.length + 1;

  {
    const row = ws.getRow(criteriaHeaderRow);
    row.height = 18;
    const proveedorCols = [7, 8, 9];
    proveedorCols.forEach((col, index) => {
      const cell = row.getCell(col);
      cell.value = `Proveedor ${index + 1}`;
      cell.font = { bold: true, size: 10, name: "Calibri" };
      center(cell);
      fill(cell, HEADER_FILL);
      border(cell);
    });
  }

  CRITERIA_ROWS.forEach(({ label, key }, index) => {
    const rowNum = criteriaHeaderRow + 1 + index;
    const row = ws.getRow(rowNum);
    row.height = 18;

    ws.mergeCells(rowNum, 1, rowNum, 6);
    const labelCell = row.getCell(1);
    labelCell.value = label;
    labelCell.font = { size: 10, name: "Calibri" };
    labelCell.alignment = { horizontal: "left", vertical: "middle" };
    for (let c = 1; c <= 6; c += 1) border(row.getCell(c));

    data.criteria.forEach((criteria, supplierIndex) => {
      const cell = row.getCell(7 + supplierIndex);
      cell.value = criteria[key];
      cell.font = { size: 10, name: "Calibri" };
      center(cell);
      border(cell);
    });
  });

  let currentRow = criteriaHeaderRow + 1 + CRITERIA_ROWS.length + 1;

  {
    const row = ws.getRow(currentRow);
    row.height = 18;
    const cell = row.getCell(1);
    cell.value = "13. Sugerencia del técnico:";
    cell.font = { bold: true, size: 11, name: "Calibri" };
    currentRow += 1;
  }
  {
    const row = ws.getRow(currentRow);
    row.height = 20;
    ws.mergeCells(currentRow, 1, currentRow, 3);
    const cell = row.getCell(1);
    cell.value = data.technicianSuggestion;
    cell.font = { size: 10, name: "Calibri" };
    for (let c = 1; c <= 3; c += 1) border(row.getCell(c));

    for (let box = 0; box < 3; box += 1) {
      const start = 4 + box;
      border(row.getCell(start));
    }
    currentRow += 2;
  }

  {
    const row = ws.getRow(currentRow);
    row.height = 18;
    const cell = row.getCell(1);
    cell.value = "14. Sugerencia del Administrador:";
    cell.font = { bold: true, size: 11, name: "Calibri" };
    currentRow += 1;
  }
  {
    const row = ws.getRow(currentRow);
    row.height = 20;
    ws.mergeCells(currentRow, 1, currentRow, 3);
    const cell = row.getCell(1);
    cell.value = data.administratorSuggestion;
    cell.font = { size: 10, name: "Calibri" };
    for (let c = 1; c <= 3; c += 1) border(row.getCell(c));

    for (let box = 0; box < 3; box += 1) {
      border(row.getCell(4 + box));
    }
    currentRow += 2;
  }

  {
    const row = ws.getRow(currentRow);
    row.height = 18;
    const cell = row.getCell(1);
    cell.value = "15. Proveedor seleccionado:";
    cell.font = { bold: true, size: 11, name: "Calibri" };
    currentRow += 1;
  }
  {
    const row = ws.getRow(currentRow);
    row.height = 18;
    ws.mergeCells(currentRow, 1, currentRow, 7);
    row.getCell(1).value = data.selectedSupplier;
    row.getCell(1).border = { bottom: BLACK };
    currentRow += 1;
  }

  {
    const row = ws.getRow(currentRow);
    row.height = 18;
    const cell = row.getCell(1);
    cell.value = "16. Justificación:";
    cell.font = { bold: true, size: 11, name: "Calibri" };
    currentRow += 1;
  }
  {
    const startRow = currentRow;
    const endRow = currentRow + 1;
    ws.mergeCells(startRow, 1, endRow, 7);
    const cell = ws.getRow(startRow).getCell(1);
    cell.value = data.justification.join("\n");
    cell.font = { size: 10, name: "Calibri" };
    cell.alignment = { horizontal: "left", vertical: "top", wrapText: true };
    for (let r = startRow; r <= endRow; r += 1) {
      ws.getRow(r).height = 20;
      for (let c = 1; c <= 7; c += 1) border(ws.getRow(r).getCell(c));
    }
    currentRow = endRow + 2;
  }

  {
    const nameRow = currentRow;
    const lineRow = currentRow + 1;
    const labelRow = currentRow + 2;

    ws.getRow(nameRow).height = 18;
    ws.mergeCells(nameRow, 1, nameRow, 3);
    const prepared = ws.getRow(nameRow).getCell(1);
    prepared.value = data.preparedBy;
    prepared.font = { bold: true, size: 11, name: "Calibri" };
    prepared.alignment = { horizontal: "center", vertical: "middle" };

    ws.mergeCells(nameRow, 5, nameRow, 7);
    const approved = ws.getRow(nameRow).getCell(5);
    approved.value = data.approvedBy;
    approved.font = { bold: true, size: 11, name: "Calibri" };
    approved.alignment = { horizontal: "center", vertical: "middle" };

    ws.getRow(lineRow).height = 6;
    ws.mergeCells(lineRow, 1, lineRow, 3);
    ws.getRow(lineRow).getCell(1).border = { top: BLACK };
    ws.mergeCells(lineRow, 5, lineRow, 7);
    ws.getRow(lineRow).getCell(5).border = { top: BLACK };

    ws.getRow(labelRow).height = 18;
    ws.mergeCells(labelRow, 1, labelRow, 3);
    const preparedLabel = ws.getRow(labelRow).getCell(1);
    preparedLabel.value = "Elaborado";
    preparedLabel.font = { bold: true, size: 10, name: "Calibri" };

    ws.mergeCells(labelRow, 5, labelRow, 7);
    const approvedLabel = ws.getRow(labelRow).getCell(5);
    approvedLabel.value = "Aprobado";
    approvedLabel.font = { bold: true, size: 10, name: "Calibri" };
  }

  if (logoUrl) {
    await addLogo(wb, ws, logoUrl);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const dateSlug = data.elaborationDate.replace(/\//g, "-");
  downloadBlob(buffer, `cuadro-comparativo-${dateSlug}.xlsx`);
}
