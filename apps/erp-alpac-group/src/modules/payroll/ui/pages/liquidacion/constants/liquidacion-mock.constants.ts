import type { Option } from "@alpac/design-system";
import type {
  CollaboratorSummary,
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

export const MOCK_COLLABORATOR: CollaboratorSummary = {
  identification: "001-230998-0001K",
  fullName: "María Elena Pérez Villanueva",
  area: "Recursos Humanos",
  costCenter: "Costo Administrativo - RRHH",
  hireDate: "15 de marzo de 2019",
  baseSalary: 28500,
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