import { Button } from "@alpac/design-system";
import {
  Focus,
  Hand,
  Move,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ToolMode } from "../layout-builder-2d.types";

interface LayoutToolbarProps {
  tool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
  isPlacementActive: boolean;
  onRotate?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onCancelPlacement?: () => void;
}

export const LayoutToolbar = ({
  tool,
  onToolChange,
  isPlacementActive,
  onRotate,
  onZoomIn,
  onZoomOut,
  onFit,
  onCancelPlacement,
}: LayoutToolbarProps) => {
  return (
    <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-1rem)] flex-wrap gap-2 rounded-md border border-slate-700 bg-slate-800/95 p-2 shadow-lg sm:left-4 sm:top-4">
      {isPlacementActive ? (
        <>
          <Button
            type="button"
            size="small"
            icon={<Move size={18} />}
            onClick={() => onToolChange("place")}
            className={`!rounded-md !px-3 !py-2 ${
              tool === "place"
                ? "!bg-alpac-primary-500 !text-white"
                : "!bg-transparent !text-slate-300 hover:!bg-slate-700"
            }`}
            title="Mover objeto"
          />
          <Button
            type="button"
            size="small"
            icon={<RotateCw size={18} />}
            onClick={onRotate}
            className="!rounded-md !bg-transparent !px-3 !py-2 !text-slate-300 hover:!bg-slate-700"
            title="Rotar 90 grados"
          />
        </>
      ) : null}

      <Button
        type="button"
        size="small"
        icon={<Hand size={18} />}
        onClick={() => onToolChange("pan")}
        className={`!rounded-md !px-3 !py-2 ${
          tool === "pan"
            ? "!bg-alpac-primary-500 !text-white"
            : "!bg-transparent !text-slate-300 hover:!bg-slate-700"
        }`}
        title="Mover lienzo"
      />

      <div className="mx-0.5 w-px self-stretch bg-slate-700" />

      <Button
        type="button"
        size="small"
        icon={<ZoomOut size={18} />}
        onClick={onZoomOut}
        className="!rounded-md !bg-transparent !px-3 !py-2 !text-slate-300 hover:!bg-slate-700"
        title="Alejar"
      />
      <Button
        type="button"
        size="small"
        icon={<ZoomIn size={18} />}
        onClick={onZoomIn}
        className="!rounded-md !bg-transparent !px-3 !py-2 !text-slate-300 hover:!bg-slate-700"
        title="Acercar"
      />
      <Button
        type="button"
        size="small"
        icon={<Focus size={18} />}
        onClick={onFit}
        className="!rounded-md !bg-transparent !px-3 !py-2 !text-slate-300 hover:!bg-slate-700"
        title="Ajustar plano"
      />

      {isPlacementActive && onCancelPlacement ? (
        <Button
          type="button"
          size="small"
          icon={<X size={18} />}
          onClick={onCancelPlacement}
          className="!rounded-md !bg-red-500/10 !px-3 !py-2 !text-red-300 hover:!bg-red-500/20"
          title="Cancelar colocación"
        />
      ) : null}
    </div>
  );
};
