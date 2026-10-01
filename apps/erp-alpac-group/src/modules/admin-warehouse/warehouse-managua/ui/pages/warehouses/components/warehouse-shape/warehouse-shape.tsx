import { Stage, Layer, Rect, Group } from "react-konva";
import { type Coordinate, type Size, type WarehouseViewerProps } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/warehouse-shape/warehouse-shape.types";
import { HorizontalMetric, VerticalMetric } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/metirics/metric";
import { useEffect, useRef, useState } from "react";
import { Grid } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/grid/grid";
import type Konva from "konva";
import { CardinalMarker } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/warehouses/components/cardinal-marker/cardinal-marker";
import { CANVAS_PADDING_LEFT, METRIC_SIZE, PIXELS_PER_METER } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/warehouse-config";
import { WarehouseAreasColorTypes } from "../warehouse-table/utils/warehouse-status";

export const WarehouseShape = ({
   width,
   length,
   draggable,
   children,
   marginTop = 0,
   marginBottom = 0,
   marginLeft = 0,
   marginRight = 0,
   title,
   selectedLabel,
   overlay,
}: WarehouseViewerProps) => {

   const warehouseX = METRIC_SIZE;
   const warehouseY = METRIC_SIZE;

   const originX = warehouseX + CANVAS_PADDING_LEFT;
   const originY = warehouseY;

   const pixelWidth = width * PIXELS_PER_METER;
   const pixelLength = length * PIXELS_PER_METER;

   const usableOffsetX = marginLeft * PIXELS_PER_METER;
   const usableOffsetY = marginTop * PIXELS_PER_METER;
   const usableWidthPx = (width - marginLeft - marginRight) * PIXELS_PER_METER;
   const usableLengthPx = (length - marginTop - marginBottom) * PIXELS_PER_METER;

   const containerRef = useRef<HTMLDivElement>(null);

   const [scale, setScale] = useState(1);
   const [stageSize, setStageSize] = useState<Size>({ width: 0, length: 0 });
   const [stageCoordinates, setStageCoordinates] = useState<Coordinate>({ x: 0, y: 0 });

   const pendingAnimationFrameId = useRef<number>(0);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const update = () => {
         setStageSize({ width: el.clientWidth, length: el.clientHeight });
      };

      update();

      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   const syncStageTransform = (stage: Konva.Stage) => {

      if (pendingAnimationFrameId.current) return;

      pendingAnimationFrameId.current = requestAnimationFrame(() => {
         pendingAnimationFrameId.current = 0;
         setStageCoordinates({ x: stage.x(), y: stage.y() });
         setScale(stage.scaleX());
      });
   };

   return (
      <section>
         {(title || selectedLabel) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
               {title && (
                  <div>{typeof title === "string" ? <span className="font-bold">{title}</span> : title}</div>
               )}
               {selectedLabel && (
                  <div>{typeof selectedLabel === "string" ? <span className="text-sm font-semibold">{selectedLabel}</span> : selectedLabel}</div>
               )}
            </div>
         )}
         <div
            ref={containerRef}
            className="relative w-full h-[50vh] md:landscape:h-[70vh] lg:h-120 lg:max-h-148 max-w-full overflow-hidden rounded-lg bg-white dark:bg-[#363a45] p-0"
         >
            {overlay}
            {stageSize.width > 0 && stageSize.length > 0 && (
               <Stage
                  width={stageSize.width}
                  height={stageSize.length}
                  scaleX={scale}
                  scaleY={scale}
                  draggable={draggable}
                  className="bg-white dark:bg-[#363a45] p-0 rounded-sm active:cursor-grabbing"
                  onDragMove={(e) => {
                     const stage = e.target.getStage();
                     if (stage) syncStageTransform(stage);
                  }}
                  onDragEnd={(e) => {
                     const stage = e.target.getStage();
                     if (!stage) return;
                     setStageCoordinates({ x: stage.x(), y: stage.y() });
                     setScale(stage.scaleX());
                  }}
                  onWheel={(e) => {
                     e.evt.preventDefault();

                     const stage = e.target.getStage();
                     const pointer = stage?.getPointerPosition();

                     if (!stage || !pointer) return;

                     const oldScale = stage.scaleX();
                     const direction = e.evt.deltaY > 0 ? -1 : 1;
                     const newScale = Math.min(3, Math.max(0.4, oldScale + direction * 0.1));

                     const mousePointTo = {
                        x: (pointer.x - stage.x()) / oldScale,
                        y: (pointer.y - stage.y()) / oldScale,
                     };

                     const nextPososition = {
                        x: pointer.x - mousePointTo.x * newScale,
                        y: pointer.y - mousePointTo.y * newScale,
                     };

                     stage.scale({ x: newScale, y: newScale });
                     stage.position(nextPososition);

                     setScale(newScale);
                     setStageCoordinates(nextPososition);
                  }}
               >
                  <Layer>
                     <HorizontalMetric
                        x={originX}
                        y={0}
                        width={pixelWidth}
                        pixelPerMeter={PIXELS_PER_METER}
                     />

                     <VerticalMetric
                        x={CANVAS_PADDING_LEFT}
                        y={originY}
                        length={pixelLength}
                        pixelPerMeter={PIXELS_PER_METER}
                     />

                     <Rect
                        x={originX}
                        y={originY}
                        width={pixelWidth}
                        height={pixelLength}
                        stroke={WarehouseAreasColorTypes["External"].color}
                        dashEnabled
                        dash={[10, 5]}
                     />

                     {(marginTop > 0 || marginBottom > 0 || marginLeft > 0 || marginRight > 0) && (
                        <Rect
                           x={originX + usableOffsetX}
                           y={originY + usableOffsetY}
                           width={usableWidthPx}
                           height={usableLengthPx}
                           stroke={WarehouseAreasColorTypes["Internal"].color}
                           dashEnabled
                           dash={[10, 5]}
                        />
                     )}

                     <Grid
                        x={stageCoordinates.x}
                        y={stageCoordinates.y}
                        width={stageSize.width}
                        length={stageSize.length}
                        scale={scale}
                        pixelPerMeter={PIXELS_PER_METER}
                     />

                     <CardinalMarker x={0} y={0} />

                     <Group
                        x={originX + usableOffsetX}
                        y={originY + usableOffsetY}>
                        {children ?? null}
                     </Group>

                  </Layer>
               </Stage>
            )}
         </div>
      </section>
   );
};
