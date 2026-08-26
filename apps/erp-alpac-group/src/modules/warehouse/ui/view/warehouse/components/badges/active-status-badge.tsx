import { Badges } from "@alpac/design-system";
export function ActiveStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badges
      label="Activa"
      color="success"
      className="bg-[#132a22]! border! border-[#1b3b30]! text-[#4ade80]!"
    />
  ) : (
    <Badges
      label="Inactiva"
      color="gray"
      className="bg-slate-800! border! border-slate-700! text-slate-400!"
    />
  );
}
