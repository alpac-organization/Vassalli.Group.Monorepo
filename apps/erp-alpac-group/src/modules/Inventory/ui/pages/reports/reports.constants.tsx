import {
  Activity,
  ArrowLeftRight,
  Boxes,
  CalendarRange,
  ClipboardList,
  Coins,
  History,
  Layers,
  RefreshCw,
  Truck,
  Wrench,
} from "lucide-react";

import type {
  ReportCatalogItem,
  ReportCategoryId,
  ReportCategoryMeta,
} from "./reports.types";

export const REPORT_CATEGORIES: Record<ReportCategoryId, ReportCategoryMeta> = {
  existences: {
    id: "existences",
    title: "Existencias y Saldos",
    tabLabel: "Existencias",
    subtitle:
      "Control de disponibilidades físicas, cortes periódicos y valorización contable de almacén.",
    icon: Boxes,
    accentBgClass: "bg-emerald-50 dark:bg-emerald-500/15",
    accentTextClass: "text-emerald-700 dark:text-emerald-300",
    accentRingClass: "ring-emerald-200 dark:ring-emerald-500/30",
  },
  movements: {
    id: "movements",
    title: "Movimiento y Rotación",
    tabLabel: "Movimiento y Rotación",
    subtitle:
      "Trazabilidad de entradas, despachos, variación de costos unitarios e indicadores de rotación.",
    icon: ArrowLeftRight,
    accentBgClass: "bg-sky-50 dark:bg-sky-500/15",
    accentTextClass: "text-sky-700 dark:text-sky-300",
    accentRingClass: "ring-sky-200 dark:ring-sky-500/30",
  },
  "equipment-outputs": {
    id: "equipment-outputs",
    title: "Salidas por Equipos",
    tabLabel: "Salidas por Equipos",
    subtitle:
      "Análisis operativo de repuestos e insumos despachados hacia maquinaria, flota y líneas de equipo.",
    icon: Truck,
    accentBgClass: "bg-amber-50 dark:bg-amber-500/15",
    accentTextClass: "text-amber-700 dark:text-amber-300",
    accentRingClass: "ring-amber-200 dark:ring-amber-500/30",
  },
};

export const REPORT_CATEGORY_ORDER: ReportCategoryId[] = [
  "existences",
  "movements",
  "equipment-outputs",
];

export const REPORT_CATALOG: ReportCatalogItem[] = [
  {
    slug: "stock-daily",
    categoryId: "existences",
    title: "Stock diario",
    description:
      "Corte actual de existencias operativas agrupadas por sucursal, área de trabajo y centro de costo.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: Boxes,
    highlights: [
      "Existencia física disponible agrupada por sucursal y área",
      "Unidad de medida, código de catálogo y estado del stock",
      "Costo promedio ponderado vigente al corte del día",
    ],
    availableFilters: ["Sucursal", "Área de trabajo", "Categoría"],
  },
  {
    slug: "inventory-period",
    categoryId: "existences",
    title: "Inventario por periodo",
    description:
      "Balance completo con saldo inicial, entradas, salidas y saldo final valorizado por producto.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: CalendarRange,
    highlights: [
      "Saldo inicial en unidades e importe al inicio del rango",
      "Totalización de compras/entradas y despachos del período",
      "Saldo final conciliado por producto y centro de costo",
    ],
    availableFilters: ["Sucursal", "Rango de fechas", "Área de trabajo"],
  },
  {
    slug: "stock-valuation",
    categoryId: "existences",
    title: "Valorización de inventario",
    description:
      "Consolidado financiero del valor total del inventario clasificado por categoría y centro de costo.",
    actionLabel: "Próximamente",
    isAvailable: false,
    icon: Coins,
    highlights: [
      "Participación porcentual del capital inmovilizado por categoría",
      "Resumen contable por centro de costo y sucursal",
      "Comparativo de costo promedio ponderado acumulado",
    ],
    availableFilters: ["Sucursal", "Centro de costo", "Categoría"],
  },
  {
    slug: "kardex",
    categoryId: "movements",
    title: "Kardex de movimientos",
    description:
      "Consulta cronológica e interactiva de entradas, salidas, documentos origen y saldos por producto.",
    actionLabel: "Ir a Kardex",
    isAvailable: true,
    icon: History,
    highlights: [
      "Trazabilidad por transacción con documento y responsable",
      "Detalle de cantidad entrante/saliente y costo promedio resultante",
      "Filtros dinámicos por tipo de movimiento, sucursal y fechas",
    ],
    availableFilters: [
      "Sucursal",
      "Área",
      "Centro de costo",
      "Tipo movimiento",
      "Fechas",
    ],
  },
  {
    slug: "inventory-movements",
    categoryId: "movements",
    title: "Movimientos de inventario",
    description:
      "Detalle ejecutivo de compras y salidas del período con análisis de costos mínimos, máximos y promedios.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: Activity,
    highlights: [
      "Unidades e importes de entradas y salidas dentro del rango",
      "Comparativa de costo mínimo, máximo y último costo registrado",
      "Documento PDF oficial con identidad visual y logo de la empresa",
    ],
    availableFilters: [
      "Sucursal",
      "Área de trabajo",
      "Centro de costo",
      "Rango de fechas",
    ],
  },
  {
    slug: "inventory-turnover",
    categoryId: "movements",
    title: "Rotación de inventario",
    description:
      "Indicadores de rotación, frecuencia de consumo, compras acumuladas y comportamiento histórico por ítem.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: RefreshCw,
    highlights: [
      "Índice de rotación calculado sobre consumo y stock promedio",
      "Detección de artículos de alta rotación o baja movilidad",
      "Formato corporativo listo para auditoría y gerencia",
    ],
    availableFilters: [
      "Sucursal",
      "Área de trabajo",
      "Centro de costo",
      "Rango de fechas",
    ],
  },
  {
    slug: "outputs-by-equipment",
    categoryId: "equipment-outputs",
    title: "Línea - Equipo",
    description:
      "Resumen operativo de salidas de almacén agrupadas por línea de maquinaria y código de activo fijo.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: Wrench,
    highlights: [
      "Agrupación jerárquica por línea operativa y equipo asignado",
      "Cantidades e importes despachados en el período consultado",
      "Control rápido de costos de mantenimiento por unidad",
    ],
    availableFilters: ["Sucursal", "Equipo / Activo", "Rango de fechas"],
  },
  {
    slug: "outputs-detail-by-equipment",
    categoryId: "equipment-outputs",
    title: "Salidas a detalle por equipo",
    description:
      "Desglose ítem por ítem de cada despacho realizado a maquinaria, indicando fecha, orden y costo.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: ClipboardList,
    highlights: [
      "Detalle individual por vale de salida, fecha y producto",
      "Trazabilidad completa de repuestos y combustibles aplicados",
      "Subtotales acumulados por equipo dentro del rango elegido",
    ],
    availableFilters: [
      "Sucursal",
      "Equipo / Activo",
      "Categoría",
      "Rango de fechas",
    ],
  },
  {
    slug: "outputs-consolidated-by-equipment",
    categoryId: "equipment-outputs",
    title: "Salidas consolidadas por equipo",
    description:
      "Matriz consolidada del gasto e insumos consumidos por activo fijo y categoría de producto.",
    actionLabel: "Configurar reporte",
    isAvailable: true,
    icon: Layers,
    highlights: [
      "Consolidado total por equipo y familia/categoría de insumo",
      "Ideal para cierres mensuales de costos de flota y planta",
      "Comparación directa del consumo operativo entre equipos",
    ],
    availableFilters: [
      "Sucursal",
      "Equipo / Activo",
      "Categoría",
      "Rango de fechas",
    ],
  },
];
