import { Button } from "@alpac/design-system";
import { Hand, SquareSquare } from "lucide-react";
import type { SectionStorageTypeValue } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import type { ToolMode } from "../layout-builder-2d.types";

interface LayoutToolbarProps {
  tool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
  showStorageTypeSelector?: boolean;
  storageTypeOptions?: { value: SectionStorageTypeValue; label: string }[];
  draftStorageType?: SectionStorageTypeValue | null;
  onDraftStorageTypeChange?: (value: SectionStorageTypeValue) => void;
  isDrawingDisabled?: boolean;
}

export const LayoutToolbar = ({
  tool,
  onToolChange,
  showStorageTypeSelector = false,
  storageTypeOptions = [],
  draftStorageType,
  onDraftStorageTypeChange,
  isDrawingDisabled = false,
}: LayoutToolbarProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-md border border-slate-700 bg-slate-800 p-2 shadow-lg">
        <Button
          type="button"
          size="small"
          icon={<SquareSquare size={18} />}
          onClick={() => onToolChange("draw")}
          disabled={isDrawingDisabled}
          className={`!px-3 !py-2 !rounded-md ${tool === "draw" ? "!bg-alpac-primary-500 !text-white" : "!bg-transparent !text-slate-400 hover:!bg-slate-700"}`}
          title="Dibujar"
        />
        <Button
          type="button"
          size="small"
          icon={<Hand size={18} />}
          onClick={() => onToolChange("pan")}
          className={`!px-3 !py-2 !rounded-md ${tool === "pan" ? "!bg-alpac-primary-500 !text-white" : "!bg-transparent !text-slate-400 hover:!bg-slate-700"}`}
          title="Mover lienzo"
        />
      </div>

      {showStorageTypeSelector && storageTypeOptions.length > 0 ? (
        <div className="rounded-md border border-slate-700 bg-slate-800 p-3 shadow-lg">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Tipo de sección
          </p>
          <div className="flex flex-col gap-1.5">
            {storageTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onDraftStorageTypeChange?.(option.value)}
                className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  draftStorageType === option.value
                    ? "bg-alpac-primary-500 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
