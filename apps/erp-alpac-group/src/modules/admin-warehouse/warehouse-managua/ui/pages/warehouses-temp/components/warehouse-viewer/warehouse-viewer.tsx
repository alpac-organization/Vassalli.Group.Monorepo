import { Stage, Layer, Rect, Group } from "react-konva";
import { type WarehouseViewerProps } from "./warehouse-viewer.types";
import { HorizontalMetric, METRIC_SIZE, VerticalMetric } from "../metirics/metric";

const LEFT_MARGIN = 40;
const RIGHT_MARGIN = 40;

export const PIXELS_PER_METER = 12; // 1m = 10px en pantalla

export const WarehouseViewer = ({ width, length, children, marginTop = 0, marginBottom = 0, marginLeft = 0, marginRight = 0 }: WarehouseViewerProps) => {

   const warehouseX = METRIC_SIZE;
   const warehouseY = METRIC_SIZE;

   const originX = warehouseX + LEFT_MARGIN;
   const originY = warehouseY;

   const pixelWidth = width * PIXELS_PER_METER;
   const pixelLength = length * PIXELS_PER_METER;

   const stageWidth = (warehouseX + pixelWidth) + RIGHT_MARGIN;
   const stageHeight = (warehouseY + pixelLength) + RIGHT_MARGIN;

   const usableOffsetX = (marginTop + marginBottom) * PIXELS_PER_METER;
   const usableOffsetY = (marginLeft + marginRight) * PIXELS_PER_METER;
   const usableWidthPx = (width - ((marginLeft + marginRight) * 2)) * PIXELS_PER_METER;
   const usableLengthPx = (length - ((marginTop + marginBottom) * 2)) * PIXELS_PER_METER;

   return (
      <section>
         <div className="flex justify-between items-center">
            <h3 className="">Plano de la bodega</h3>
            <span>Sección seleccionada: SECTION_001</span>
         </div>
         <div className="w-full max-w-full overflow-auto rounded-sm bg-white dark:bg-[#363a45] p-5">
            <Stage width={stageWidth + LEFT_MARGIN} height={stageHeight} className="bg-white dark:bg-[#363a45] p-5 rounded-sm">
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

                  <Group x={originX + usableOffsetX} y={originY + usableOffsetY}>
                     {children ?? null}
                  </Group>

               </Layer>
            </Stage>
         </div>
      </section>
   );
};
