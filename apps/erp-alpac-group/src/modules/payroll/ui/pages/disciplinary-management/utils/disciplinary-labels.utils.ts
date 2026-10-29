import { resolveEnumValue } from "@app/shared/utils/enum.utils";

const DEFAULT_BADGE_CLASS =
  "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!";

/** Lookup de clases de badge por clave de `FaultSeverity`. */
export const FaultSeverityBadgeClassByKey: Record<string, string> = {
  Minor: "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!",
  Serious: "bg-orange-100! text-orange-800! dark:bg-orange-900/40! dark:text-orange-200!",
  VerySerious: "bg-rose-100! text-rose-800! dark:bg-rose-900/40! dark:text-rose-200!",
};

/** Lookup de clases de badge por valor numérico de `FaultSeverity`. */
export const FaultSeverityBadgeClassByValue: Record<number, string> = {
  1: FaultSeverityBadgeClassByKey.Minor,
  2: FaultSeverityBadgeClassByKey.Serious,
  3: FaultSeverityBadgeClassByKey.VerySerious,
};

/** Lookup de clases de badge por clave de `FaultStatus`. */
export const FaultStatusBadgeClassByKey: Record<string, string> = {
  Open: "bg-amber-100! text-amber-800! dark:bg-amber-900/40! dark:text-amber-200!",
  SanctionApplied: "bg-emerald-100! text-emerald-800! dark:bg-emerald-900/40! dark:text-emerald-200!",
  Prescribed: "bg-slate-100! text-slate-700! dark:bg-slate-700/50! dark:text-slate-300!",
};

/** Lookup de clases de badge por valor numérico de `FaultStatus`. */
export const FaultStatusBadgeClassByValue: Record<number, string> = {
  1: FaultStatusBadgeClassByKey.Open,
  2: FaultStatusBadgeClassByKey.SanctionApplied,
  3: FaultStatusBadgeClassByKey.Prescribed,
};

/** Lookup de clases de badge por clave de `FaultSource`. */
export const FaultSourceBadgeClassByKey: Record<string, string> = {
  Manual: "bg-sky-100! text-sky-800! dark:bg-sky-900/40! dark:text-sky-200!",
  SystemEscalation: "bg-violet-100! text-violet-800! dark:bg-violet-900/40! dark:text-violet-200!",
  BiometricClock: "bg-cyan-100! text-cyan-800! dark:bg-cyan-900/40! dark:text-cyan-200!",
};

/** Lookup de clases de badge por valor numérico de `FaultSource`. */
export const FaultSourceBadgeClassByValue: Record<number, string> = {
  1: FaultSourceBadgeClassByKey.Manual,
  2: FaultSourceBadgeClassByKey.SystemEscalation,
  3: FaultSourceBadgeClassByKey.BiometricClock,
};

/** Lookup de clases de badge por clave de `SanctionType`. */
export const SanctionTypeBadgeClassByKey: Record<string, string> = {
  VerbalWarning: "bg-sky-100! text-sky-800! dark:bg-sky-900/40! dark:text-sky-200!",
  Memorandum: "bg-amber-100! text-amber-800! dark:bg-amber-900/40! dark:text-amber-200!",
  Suspension: "bg-orange-100! text-orange-800! dark:bg-orange-900/40! dark:text-orange-200!",
  CommitmentLetter: "bg-violet-100! text-violet-800! dark:bg-violet-900/40! dark:text-violet-200!",
  Termination: "bg-rose-100! text-rose-800! dark:bg-rose-900/40! dark:text-rose-200!",
};

/** Lookup de clases de badge por valor numérico de `SanctionType`. */
export const SanctionTypeBadgeClassByValue: Record<number, string> = {
  1: SanctionTypeBadgeClassByKey.VerbalWarning,
  2: SanctionTypeBadgeClassByKey.Memorandum,
  3: SanctionTypeBadgeClassByKey.Suspension,
  4: SanctionTypeBadgeClassByKey.CommitmentLetter,
  5: SanctionTypeBadgeClassByKey.Termination,
};

/** Lookup de clases de badge por clave de `SanctionStatus`. */
export const SanctionStatusBadgeClassByKey: Record<string, string> = {
  Applied: "bg-emerald-100! text-emerald-800! dark:bg-emerald-900/40! dark:text-emerald-200!",
  Cancelled: "bg-rose-100! text-rose-800! dark:bg-rose-900/40! dark:text-rose-200!",
};

/** Lookup de clases de badge por valor numérico de `SanctionStatus`. */
export const SanctionStatusBadgeClassByValue: Record<number, string> = {
  1: SanctionStatusBadgeClassByKey.Applied,
  2: SanctionStatusBadgeClassByKey.Cancelled,
};

export const getFaultSeverityBadgeClass = (
  value: string | number | null | undefined,
): string =>
  resolveEnumValue(
    value,
    FaultSeverityBadgeClassByKey,
    FaultSeverityBadgeClassByValue,
    DEFAULT_BADGE_CLASS,
  );

export const getFaultStatusBadgeClass = (
  value: string | number | null | undefined,
): string =>
  resolveEnumValue(
    value,
    FaultStatusBadgeClassByKey,
    FaultStatusBadgeClassByValue,
    DEFAULT_BADGE_CLASS,
  );

export const getFaultSourceBadgeClass = (
  value: string | number | null | undefined,
): string =>
  resolveEnumValue(
    value,
    FaultSourceBadgeClassByKey,
    FaultSourceBadgeClassByValue,
    DEFAULT_BADGE_CLASS,
  );

export const getSanctionTypeBadgeClass = (
  value: string | number | null | undefined,
): string =>
  resolveEnumValue(
    value,
    SanctionTypeBadgeClassByKey,
    SanctionTypeBadgeClassByValue,
    DEFAULT_BADGE_CLASS,
  );

export const getSanctionStatusBadgeClass = (
  value: string | number | null | undefined,
): string =>
  resolveEnumValue(
    value,
    SanctionStatusBadgeClassByKey,
    SanctionStatusBadgeClassByValue,
    DEFAULT_BADGE_CLASS,
  );
