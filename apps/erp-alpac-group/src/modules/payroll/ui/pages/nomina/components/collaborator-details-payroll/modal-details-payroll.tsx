import { Modal } from "@alpac/design-system";
import {
  User,
  Briefcase,
  MapPin,
  Hash,
  Calendar,
  FileText,
} from "lucide-react";
import type { PayrollItemResponse } from "@app/modules/payroll/domain/ApiContract/Responses/payroll-responses/get-payroll";
import { parseAdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/utils/parse-additional-deductions";
import type { AdditionalDeductions } from "@app/modules/payroll/ui/pages/nomina/components/payroll-table/types/payroll-table.types";
import { formatCurrency } from "@app/shared/utils/currency.utils";
import {
  formatIdentificationNumber,
  formatDate,
} from "@app/shared/utils/string.utils";

interface ModalDetailsPayrollProps {
  isOpen: boolean;
  onClose: () => void;
  payrollItem: PayrollItemResponse | null;
  onEditDeductions?: () => void;
}

const DEDUCTION_META: Record<
  keyof AdditionalDeductions,
  { label: string; abbrev: string }
> = {
  Loans: { label: "Préstamos", abbrev: "PR" },
  Absences: { label: "Ausencias", abbrev: "AUS" },
  Purisima: { label: "Purísima", abbrev: "PUR" },
  Sanction: { label: "Sanción", abbrev: "SAN" },
  CashShortage: { label: "Faltante de Caja", abbrev: "FC" },
  LateArrivals: { label: "Llegadas Tardías", abbrev: "LT" },
  LateArrivalsInMinutes: { label: "Llegadas Tardías (min)", abbrev: "LTM" },
  SalaryAdvance: { label: "Adelanto de Salario", abbrev: "AS" },
  OtherDeductions: { label: "Otras Deducciones", abbrev: "OD" },
  JudicialSeizures: { label: "Embargo Judicial", abbrev: "EJ" },
  UniformDeduction: { label: "Deducción de Uniforme", abbrev: "DU" },
  ChristmasBonusAdvance: { label: "Aguinaldo Anticipado", abbrev: "AA" },
  DeductionForLossesBulk: { label: "Deducción por Pérdidas", abbrev: "DP" },
  ChildSupportGarnishment: { label: "Pensión Alimenticia", abbrev: "PA" },
};

export function ModalDetailsPayroll({
  isOpen,
  onClose,
  payrollItem,
  onEditDeductions,
}: ModalDetailsPayrollProps): React.ReactNode {
  const collaborator = payrollItem?.collaborator ?? null;

  const additionalDeductions = parseAdditionalDeductions(
    payrollItem?.deductions_additional_data,
  );

  const activeDeductions = additionalDeductions
    ? (
        Object.entries(additionalDeductions) as [
          keyof AdditionalDeductions,
          number,
        ][]
      ).filter(([, value]) => typeof value === "number" && value > 0)
    : [];

  const totalActiveDeductions = activeDeductions.reduce(
    (sum, [, value]) => sum + value,
    0,
  );

  const formattedIdentification = (() => {
    const id = collaborator?.identification_number;
    if (!id) return "—";
    if (id.length !== 14) return id;
    return formatIdentificationNumber(id);
  })();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="2xl"
      title="Detalles del Colaborador"
    >
      <div className="flex flex-col gap-4 pb-2">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-700 dark:bg-[#1e2229]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <User className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-slate-900 dark:text-white">
              {collaborator?.full_name || "—"}
            </p>
            <p className="mt-0.5 font-mono text-sm text-slate-500 dark:text-slate-400">
              {collaborator?.collaborator_code || "—"}
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end sm:flex">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Identificación
            </span>
            <span className="mt-0.5 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formattedIdentification}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoCard
            icon={<Briefcase className="h-4 w-4" />}
            label="CARGO"
            value={collaborator?.job_position || "—"}
          />
          <InfoCard
            icon={<MapPin className="h-4 w-4" />}
            label="ÁREA"
            value={collaborator?.work_area || "—"}
          />
          <InfoCard
            icon={<Hash className="h-4 w-4" />}
            label="NÚMERO INSS"
            value={collaborator?.inss_number || "—"}
            mono
          />
          <InfoCard
            icon={<Calendar className="h-4 w-4" />}
            label="FECHA DE INGRESO"
            value={
              collaborator?.entry_date
                ? formatDate(collaborator.entry_date)
                : "—"
            }
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-neutral-700">
            <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deducciones
            </h5>
          </div>

          <div className="flex flex-col gap-4 p-4">
            {activeDeductions.length > 0 ? (
              <>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Tipos de deducciones disponibles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeDeductions.map(([key]) => {
                      const meta = DEDUCTION_META[key];
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {meta?.label ?? key}{" "}
                          <span className="ml-1 font-normal opacity-70">
                            ({meta?.abbrev ?? key})
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Deducciones Activas
                    </p>
                    <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                      {activeDeductions.length} activa
                      {activeDeductions.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
                    {activeDeductions.map(([key, value]) => {
                      const meta = DEDUCTION_META[key];
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3"
                        >
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {meta?.label ?? key}
                          </span>
                          <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(value, "NIO")}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-neutral-600">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total de Deducciones
                    </span>
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(totalActiveDeductions, "NIO")}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="py-2 text-center text-sm text-slate-400 dark:text-slate-500">
                No hay deducciones adicionales registradas para este período.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-slate-200 dark:hover:bg-neutral-700"
          >
            Cerrar
          </button>
          {onEditDeductions && (
            <button
              type="button"
              onClick={onEditDeductions}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Editar Deducciones
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function InfoCard({
  icon,
  label,
  value,
  mono,
}: InfoCardProps): React.ReactNode {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-neutral-700 dark:bg-[#1e2229]">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={`truncate text-sm font-semibold text-slate-900 dark:text-white ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
