import type { Option } from "@alpac/design-system";
import type {
  CollaboratorSummary,
  LiquidacionCalculationDetail,
  LiquidacionConcept,
} from "../types/liquidacion.types";

export const LIQUIDACION_STEPS = [
  "Colaborador",
  "Parámetros",
  "Conceptos",
  "Cierre",
];

export const LIQUIDACION_TYPE_OPTIONS: Option[] = [
  { label: "Renuncia", value: "renuncia" },
  { label: "Despido", value: "despido" },
  { label: "Fin de contrato", value: "fin-contrato" },
  { label: "Mutuo acuerdo", value: "mutuo-acuerdo" },
];

export const CONTADOR_REVIEW_OPTIONS: Option[] = [
  { label: "Pendiente de revisión", value: "pendiente" },
  { label: "Cálculos correctos", value: "correcto" },
  { label: "Cálculos incorrectos", value: "incorrecto" },
];

export const MOCK_COLLABORATOR: CollaboratorSummary = {
  identification: "001-230998-0001K",
  fullName: "María Elena Pérez Villanueva",
  area: "Recursos Humanos",
  costCenter: "Costo Administrativo - RRHH",
  hireDate: "15 de marzo de 2019",
  baseSalary: 28500,
  salaryType: "Fijo",
  status: "Activo",
};

export const MOCK_LIQUIDACION_CONCEPTS: LiquidacionConcept[] = [
  {
    id: "cesantia",
    concepto: "Cesantía (8.33%)",
    tipo: "ingreso",
    monto: 11875,
    estado: "Aplicado",
  },
  {
    id: "vacaciones",
    concepto: "Vacaciones no gozadas",
    tipo: "ingreso",
    monto: 5420,
    estado: "Aplicado",
  },
  {
    id: "aguinaldo",
    concepto: "Aguinaldo proporcional",
    tipo: "ingreso",
    monto: 7125,
    estado: "Aplicado",
  },
  {
    id: "preaviso",
    concepto: "Preaviso",
    tipo: "ingreso",
    monto: 9500,
    estado: "Pendiente",
  },
  {
    id: "inss",
    concepto: "INSS retenido",
    tipo: "deduccion",
    monto: 1780,
    estado: "Aplicado",
  },
  {
    id: "ir",
    concepto: "Impuesto sobre la renta",
    tipo: "deduccion",
    monto: 2360,
    estado: "Aplicado",
  },
  {
    id: "anticipo",
    concepto: "Anticipo de salario",
    tipo: "deduccion",
    monto: 1500,
    estado: "Pendiente",
  },
];

export const MOCK_LIQUIDACION_CALCULATION_DETAILS: LiquidacionCalculationDetail[] =
  [
    {
      id: "salario",
      concepto: "Salario",
      valor: 9990.55,
      parametro: "Num Días",
      cantidad: "7",
      kind: "concepto",
    },
    {
      id: "vacaciones",
      concepto: "Vacaciones",
      valor: 59988.73,
      parametro: "Num Días",
      kind: "concepto",
    },
    {
      id: "aguinaldo",
      concepto: "Aguinaldo",
      valor: 42104.87,
      parametro: "Num Días",
      cantidad: "29.5",
      kind: "concepto",
    },
    {
      id: "indemnizacion",
      concepto: "Indemnización",
      valor: 214092.55,
      parametro: "Num Meses",
      cantidad: "5",
      kind: "concepto",
    },
    {
      id: "antiguedad-salario-vacaciones",
      concepto: "Antigüedad Salario + Vacaciones",
      valor: null,
      kind: "concepto",
    },
    {
      id: "antiguedad-aguinaldo-indemnizacion",
      concepto: "Antigüedad Aguinaldo + Indemnización",
      valor: 0,
      parametro: "x",
      kind: "concepto",
    },
    {
      id: "inss-laboral",
      concepto: "INSS Laboral",
      valor: null,
      kind: "deduccion",
    },
    {
      id: "inss-patronal",
      concepto: "INSS Patronal",
      valor: null,
      kind: "deduccion",
    },
    {
      id: "ir",
      concepto: "IR",
      valor: null,
      kind: "deduccion",
    },
    {
      id: "inatec",
      concepto: "INATEC",
      valor: null,
      kind: "deduccion",
    },
    {
      id: "otras-deducciones",
      concepto: "Otras deducciones",
      valor: null,
      kind: "deduccion",
    },
    {
      id: "devolucion-purísima",
      concepto: "Devolución de Purísima",
      valor: null,
      kind: "concepto",
    },
    {
      id: "depreciacion",
      concepto: "Depreciación",
      valor: null,
      kind: "concepto",
    },
    {
      id: "viatico-alimentacion",
      concepto: "Viático de Alimentación",
      valor: null,
      kind: "concepto",
    },
    {
      id: "viatico-transporte",
      concepto: "Viático de Transporte",
      valor: null,
      kind: "concepto",
    },
    {
      id: "comisiones",
      concepto: "Comisiones",
      valor: null,
      kind: "concepto",
    },
  ];