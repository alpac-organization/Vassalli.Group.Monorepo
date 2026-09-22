import { Stage, Layer, Rect, Group } from "react-konva";
import { type WarehouseViewerProps } from "./warehouse-shape.types";
import { HorizontalMetric, METRIC_SIZE, VerticalMetric } from "../metirics/metric";
import { useEffect, useRef, useState } from "react";
import { Grid } from "../grid/grid";

const LEFT_MARGIN = 40;

export const PIXELS_PER_METER = 12;

export const WarehouseShape = ({
   width,
   length,
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
   const [stageWidth, setStageWidth] = useState(0);
   const [stageLength, setStageLength] = useState(0);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const update = () => {
         setStageWidth(el.clientWidth);
         setStageLength(el.clientHeight);
      };

      update();

      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   return (
      <section>
         <div className="flex justify-between items-center">
            <h3 className="">Plano de la bodega</h3>
            <span>Sección seleccionada: SECTION_001</span>
         </div>
         <div
            ref={containerRef}
            className="w-full h-[70vh] max-w-full overflow-auto rounded-sm bg-white dark:bg-[#363a45] p-0"
         >
            <Stage
               width={stageWidth}
               height={stageLength}
               scaleX={scale}
               scaleY={scale}
               draggable
               className="bg-white dark:bg-[#363a45] p-0 rounded-sm active:cursor-grabbing"
               onWheel={(e) => {
                  e.evt.preventDefault();
                  const direction = e.evt.deltaY > 0 ? -1 : 1;

                  const stage = e.target.getStage();
                  const pointer = stage?.getPointerPosition();
                  const oldScale = stage?.scaleX();

                  if (pointer && stage && oldScale) {
                     const mousePointTo = {
                        x: (pointer.x - stage.x()) / oldScale,
                        y: (pointer.y - stage.y()) / oldScale,
                     };
                     const newScale = Math.min(
                        3,
                        Math.max(0.4, scale + direction * 0.1),
                     );

                     stage.scale({ x: newScale, y: newScale });
                     stage.position({
                        x: pointer.x - mousePointTo.x * newScale,
                        y: pointer.y - mousePointTo.y * newScale,
                     });

                     setScale(newScale);
                  }
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
                     width={stageWidth / PIXELS_PER_METER}
                     length={stageLength / PIXELS_PER_METER}
                     pixelPerMeter={PIXELS_PER_METER}
                  />

                  <Group x={originX + usableOffsetX} y={originY + usableOffsetY}>
                     {children ?? null}
                  </Group>
                  
               </Layer>
            </Stage>
         </div>
      </section>
   );
};
