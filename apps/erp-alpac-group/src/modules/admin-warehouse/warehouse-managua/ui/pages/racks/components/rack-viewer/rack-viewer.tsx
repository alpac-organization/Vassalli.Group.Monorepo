import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronRight, Layers } from "lucide-react";
import { LegendItem } from "@app/shared/components/legend-item/legend-item";
import { PIXELS_PER_METER, WarehouseShape } from "../../../warehouses-temp/components/warehouse-shape/warehouse-shape";
import { RACK_STATUS_LEGEND } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/rack-status-badge";
import { RackShape } from "../rack-shape/rack-shape";
import { Group, Rect } from "react-konva";
import type { RackViewerProps } from "./rack-viewer.types";
import type { RackDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/racks/get-racks-res";

// Medidas mock de bodega como en secciones.tsx
const WAREHOUSE_WIDTH = 37.35;
const WAREHOUSE_LENGTH = 61.02;
const WAREHOUSE_MARGINS = {
  top: 0.6,
  bottom: 0.4,
  left: 0.6,
  right: 0.6,
};

export const RackViewer = ({
  className = "",
  racks = [],
  selectedRackId = null,
  sectionCode,
  warehouseName ,
  sectionWidth = 0,
  sectionLength = 0,
  sectionPositionX = 0,
  sectionPositionY = 0,
  onSelectRack,
}: RackViewerProps) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const activeSelectedId = selectedRackId ?? internalSelectedId;



  const [activeLevelFilter, setActiveLevelFilter] = useState<number | null>(null);

  const availableLevels = useMemo(() => {
    const set = new Set(racks.map((r) => r.level_number).filter(Boolean));
    return Array.from(set).sort((a, b) => a - b);
  }, [racks]);

  useEffect(() => {
    if (activeLevelFilter !== null && !availableLevels.includes(activeLevelFilter)) {
      setActiveLevelFilter(null);
    }
  }, [availableLevels, activeLevelFilter]);

  const displayedRacks = useMemo(() => {
    if (activeLevelFilter == null) return racks;
    return racks.filter((r) => r.level_number === activeLevelFilter);
  }, [racks, activeLevelFilter]);

  const handleSelect = (rack: RackDto) => {
    const id = rack.rack_id || null;
    setInternalSelectedId(id);
    onSelectRack?.(rack);
  };



  const activeSectionCode = sectionCode ?? "SECTION_A004";
  const secX = sectionPositionX * PIXELS_PER_METER;
  const secY = sectionPositionY * PIXELS_PER_METER;
  const secWidthPx = sectionWidth * PIXELS_PER_METER;
  const secLengthPx = sectionLength * PIXELS_PER_METER;

  return (
    <section
      className={`w-full rounded-lg gap-3 p-6 overflow-visible border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34] ${className}`}
    >
      {availableLevels.length > 1 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-slate-400">Ver nivel en plano:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveLevelFilter(null)}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                activeLevelFilter === null
                  ? "bg-alpac-primary-500! text-white!"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Todos
            </button>
            {availableLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setActiveLevelFilter(lvl)}
                className={`px-2.5 py-0.5 rounded text-xs font-medium transition-colors ${
                  activeLevelFilter === lvl
                    ? "bg-alpac-primary-500! text-white!"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Nivel {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      <WarehouseShape
        title={
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
              <Building2 size={15} className="text-slate-500" />
              {warehouseName || "Bodega"}
            </span>
            <ChevronRight size={13} className="text-slate-500" />
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
              <Layers size={12} />
              {activeSectionCode}
            </span>
             <ChevronRight size={13} className="text-slate-500" />
            {sectionWidth > 0 && sectionLength > 0 && (
              <span className="text-[11px] text-slate-500 font-normal">
                ({sectionWidth}m × {sectionLength}m)
              </span>
            )}

          </nav>
        }
        width={WAREHOUSE_WIDTH}
        length={WAREHOUSE_LENGTH}
        marginTop={WAREHOUSE_MARGINS.top}
        marginBottom={WAREHOUSE_MARGINS.bottom}
        marginLeft={WAREHOUSE_MARGINS.left}
        marginRight={WAREHOUSE_MARGINS.right}
      >
        {/* Única sección visualizada dentro de la bodega: la sección activa seleccionada */}
        <Group x={secX} y={secY}>
          {/* Fondo y borde perimetral de la sección */}
          <Rect
            width={secWidthPx}
            height={secLengthPx}
            fill="rgba(56, 189, 248, 0.06)"
            stroke="#38bdf8"
            strokeWidth={1}
            cornerRadius={1}
          />
          
          {/* Racks dentro de la sección activa */}
          {displayedRacks.map((rack) => {
            const currentId = rack.rack_id;
            const isVertical = (sectionLength || 0) >= (sectionWidth || 0);
            return (
              <RackShape
                key={currentId}
                rack={rack}
                selected={activeSelectedId === currentId}
                pixelsPerMeter={PIXELS_PER_METER}
                canvasWidth={sectionWidth}
                isVertical={isVertical}
                onSelect={handleSelect}
              />
            );
          })}
        
        </Group>
        
      </WarehouseShape>

      <div className="flex gap-x-4 gap-y-1 items-center mt-3 flex-wrap">
        {RACK_STATUS_LEGEND.map((item) => (
          <LegendItem key={item.text} text={item.text} color={item.color} />
        ))}
      </div>
    </section>
  );
};
