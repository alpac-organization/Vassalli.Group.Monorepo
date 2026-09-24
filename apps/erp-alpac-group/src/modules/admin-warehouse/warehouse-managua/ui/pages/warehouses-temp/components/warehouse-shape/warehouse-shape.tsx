import { Stage, Layer, Rect, Group } from "react-konva";
import { type Position, type Size, type WarehouseViewerProps } from "./warehouse-shape.types";
import { HorizontalMetric, METRIC_SIZE, VerticalMetric } from "../metirics/metric";
import { useEffect, useRef, useState } from "react";
import { Grid } from "../grid/grid";
import type Konva from "konva";
import { CardinalMarker } from "../cardinal-marker/cardinal-marker";

const LEFT_MARGIN = 40;

export const PIXELS_PER_METER = 12;

export const WarehouseShape = ({
   width,
   length,
   draggable,
   children,
   marginTop = 0,
   marginBottom = 0,
   marginLeft = 0,
   marginRight = 0,
}: WarehouseViewerProps) => {

   const warehouseX = METRIC_SIZE;
   const warehouseY = METRIC_SIZE;

   const originX = warehouseX + LEFT_MARGIN;
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
   const [stagePosition, setStagePosition] = useState<Position>({ x: 0, y: 0 });

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
         setStagePosition({ x: stage.x(), y: stage.y() });
         setScale(stage.scaleX());
      });
   };

   return (
      <section>
         
         <div
            ref={containerRef}
            className="w-full h-[50vh] md:landscape:h-[70vh] lg:h-120 lg:max-h-144 max-w-full overflow-auto rounded-lg bg-white dark:bg-[#363a45] p-0"
         >

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
                  setStagePosition({ x: stage.x(), y: stage.y() });
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
                  setStagePosition(nextPososition);
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
                     x={LEFT_MARGIN}
                     y={originY}
                     length={pixelLength}
                     pixelPerMeter={PIXELS_PER_METER}
                  />

                  <Rect
                     x={originX}
                     y={originY}
                     width={pixelWidth}
                     height={pixelLength}
                     stroke="#38bdf8"
                     dashEnabled
                     dash={[10, 5]}
                  />

                  <Rect
                     x={originX + usableOffsetX}
                     y={originY + usableOffsetY}
                     width={usableWidthPx}
                     height={usableLengthPx}
                     stroke="#d467f5"
                     dashEnabled
                     dash={[10, 5]}
                  />

                  <Grid
                     x={stagePosition.x}
                     y={stagePosition.y}
                     width={stageSize.width}
                     length={stageSize.length}
                     scale={scale}
                     pixelPerMeter={PIXELS_PER_METER}
                  />

                  <CardinalMarker x={0} y={0} />

                  <Group x={originX + usableOffsetX} y={originY + usableOffsetY}>
                     {children ?? null}
                  </Group>

               </Layer>
            </Stage>
         </div>
      </section>
   );
};
