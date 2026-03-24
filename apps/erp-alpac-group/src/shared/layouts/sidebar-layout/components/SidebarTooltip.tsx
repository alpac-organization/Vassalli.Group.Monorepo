import type { SidebarToolTipProps } from "../sidebar.types";

export default function SidebarTooltip({ text }: SidebarToolTipProps) {
  return (
    <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#1E1E2D] text white">
      {text}
    </div>
  );
}
