import type { ModalInfoFieldProps } from "@app/shared/components/modal-info-field/modal-info-field.types";

export function ModalInfoField({ label, value, valueClassName = "text-sm", labelClassName }: ModalInfoFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-xs font-bold uppercase tracking-wide text-slate-400 ${labelClassName ?? ""}`}>
        {label}
      </span>
      <div className={`font-medium text-white ${valueClassName}`}>{value ?? "—"}</div>
    </div>
  );
}