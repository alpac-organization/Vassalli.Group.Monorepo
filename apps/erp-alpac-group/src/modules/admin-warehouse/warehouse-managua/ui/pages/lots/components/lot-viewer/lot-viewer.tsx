import { useCallback, useMemo } from "react";
import { Group } from "react-konva";
import { Button } from "@alpac/design-system";
import { Building2, ChevronRight, Layers, RotateCw, Save, Undo2 } from "lucide-react";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { PIXELS_PER_METER, WarehouseShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses-temp/components/warehouse-shape/warehouse-shape";
import { RACK_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { SectionShape } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-shape/section-shape";
import { LotShape } from "../lot-shape/lot-shape";
import type { LotPosition } from "../lot-shape/lot-shape.types";
import type { LotViewerProps } from "./lot-viewer.types";

const EMPTY_POSITION: LotPosition = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationY: 0,
};

// Medidas mock de bodega como en racks/secciones
const WAREHOUSE_WIDTH = 37.35;
const WAREHOUSE_LENGTH = 61.02;
const WAREHOUSE_MARGINS = {
  top: 0.6,
  bottom: 0.4,
  left: 0.6,
  right: 0.6,
};

export const LotViewer = ({
  className,
  lots,
  sectionWidth,
  sectionLength,
  sectionCode,
  sectionPositionX = 0,
  sectionPositionY = 0,
  sectionIsActive = true,
  selectedLotId,
  isLoading = false,
  isSaving = false,
  hasPendingChanges = false,
  onSelectLot,
  onPositionChange,
  onRotateLot,
  onSave,
  onDiscard,
}: LotViewerProps) => {
  const hasDimensions = sectionWidth > 0 && sectionLength > 0;

  const handleSelect = useCallback(
    (lot: LotViewerProps["lots"][number]["lot"]) => onSelectLot?.(lot),
    [onSelectLot],
  );

  const positionedCount = useMemo(
    () => lots.filter((entry) => entry.savedPosition !== null).length,
    [lots],
  );

  const title = (
    <nav className="flex items-center gap-2 text-xs font-medium flex-wrap text-slate-400">
      <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
        <Building2 size={15} className="text-slate-500" />
        Seccion
      </span>
      <ChevronRight size={13} className="text-slate-500" />
      <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
        <Layers size={12} />
        {sectionCode || "SIN CODIGO"}
      </span>
      {hasDimensions && (
        <>
          <ChevronRight size={13} className="text-slate-500" />
          <span className="text-[11px] font-normal text-slate-500">
            ({sectionWidth} m x {sectionLength} m)
          </span>
        </>
      )}
    </nav>
  );

  const selectedLabel = (
    <div className="flex items-center gap-3 text-[11px] text-slate-500">
      <span>
        Tramos posicionados: {positionedCount} / {lots.length}
      </span>
      {hasPendingChanges && (
        <span className="font-semibold text-amber-400">
          Cambios sin guardar
        </span>
      )}
    </div>
  );

  return (
    <section
      className={`flex w-full min-w-0 flex-col gap-3 rounded-lg border border-slate-600 bg-white p-4 hover:border-neutral-600 dark:bg-[#272b34] ${className ?? ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[11px] text-slate-500">
            Arrastre los tramos dentro de la seccion para grabar sus
            coordenadas.
          </p>
          {!hasDimensions && (
            <p className="text-[11px] font-semibold text-amber-400">
              {isLoading
                ? "Cargando dimensiones de la seccion..."
                : "La seccion no tiene dimensiones registradas; se muestra solo la bodega."}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="small"
            label="Rotar 90°"
            icon={<RotateCw size={14} />}
            disabled={!selectedLotId || isSaving}
            onClick={() => selectedLotId && onRotateLot?.(selectedLotId)}
            className="rounded-md! border! border-slate-300! bg-white! text-slate-700! hover:bg-slate-50! sm:w-auto! dark:border-slate-600! dark:bg-transparent! dark:text-slate-300! dark:hover:border-slate-700/30!"
          />
          <Button
            type="button"
            size="small"
            label="Descartar"
            icon={<Undo2 size={14} />}
            disabled={!hasPendingChanges || isSaving}
            onClick={onDiscard}
            className="rounded-md! border! border-slate-300! bg-white! text-slate-700! hover:bg-slate-50! sm:w-auto! dark:border-slate-600! dark:bg-transparent! dark:text-slate-300! dark:hover:border-slate-700/30!"
          />
          <Button
            type="button"
            size="small"
            label="Guardar posiciones"
            icon={<Save size={14} />}
            isLoading={isSaving}
            disabled={!hasPendingChanges || isSaving}
            onClick={onSave}
            className="rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
          />
        </div>
      </div>

      {/* Como en racks: la bodega se dibuja siempre; la seccion y los tramos solo cuando tienen dimensiones */}
      <WarehouseShape
        title={title}
        selectedLabel={selectedLabel}
        width={WAREHOUSE_WIDTH}
        length={WAREHOUSE_LENGTH}
        marginTop={WAREHOUSE_MARGINS.top}
        marginBottom={WAREHOUSE_MARGINS.bottom}
        marginLeft={WAREHOUSE_MARGINS.left}
        marginRight={WAREHOUSE_MARGINS.right}
        containerClassName="relative h-[340px] w-full max-w-full overflow-hidden rounded-lg bg-white p-0 dark:bg-[#363a45]"
      >
        {/* Posicion real de la seccion dentro de la bodega */}
        {hasDimensions && (
          <Group
            x={sectionPositionX * PIXELS_PER_METER}
            y={sectionPositionY * PIXELS_PER_METER}
          >
            {/* La seccion se dibuja tal cual existe en el render de Secciones */}
            <SectionShape
              id={`section-${sectionCode ?? "sin-codigo"}`}
              code={sectionCode ?? undefined}
              x={0}
              y={0}
              width={sectionWidth}
              length={sectionLength}
              rotation={0}
              status={sectionIsActive ? "available" : "maintenance"}
              selected={false}
              pixelsPerMeter={PIXELS_PER_METER}
            />

            {/* Tramos posicionados dentro de la seccion (coordenadas relativas a ella) */}
            {lots.map((entry) => (
              <LotShape
                key={entry.lot.id}
                lot={entry.lot}
                width={entry.width}
                length={entry.length}
                position={entry.draftPosition ?? entry.savedPosition ?? EMPTY_POSITION}
                selected={selectedLotId === entry.lot.id}
                pixelsPerMeter={PIXELS_PER_METER}
                sectionWidth={sectionWidth}
                sectionLength={sectionLength}
                isPositioned={entry.savedPosition !== null}
                onSelect={handleSelect}
                onPositionChange={onPositionChange}
              />
            ))}
          </Group>
        )}
      </WarehouseShape>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {RACK_STATUS_LEGEND.map((item) => (
          <LegendItem key={item.text} text={item.text} color={item.color} />
        ))}
      </div>
    </section>
  );
};
