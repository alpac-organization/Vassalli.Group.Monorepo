import type { ModalInfoFieldProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/supply-requests/components/modal-info-field/types/modal-info-field.types";

export function ModalInfoField({ label, value, valueClassName = "text-[13px]" }: ModalInfoFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#91A0B5]">
        {label}
      </span>
      <div className={`font-medium text-[#E2E8F0] ${valueClassName}`}>{value ?? "—"}</div>
    </div>
  );
}