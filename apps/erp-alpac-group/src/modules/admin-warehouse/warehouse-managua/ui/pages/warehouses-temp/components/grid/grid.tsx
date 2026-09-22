import { Line, Shape } from "react-konva";
import type { GridProps } from "./grid.types";

export const Grid = ({ width, length, step = 1, pixelPerMeter }: GridProps) => {
   // const verticalLines = [];
   // const horizontalLines = [];

   const widthPx = width * pixelPerMeter;
   const lengthPx = length * pixelPerMeter;

   /* for (let x = 0; x <= width; x += step) {
     verticalLines.push(
       <Line
         key={`v-${x}`}
         points={[x * pixelPerMeter, 0, x * pixelPerMeter, lengthPx]}
         stroke="#0751ba"
         strokeWidth={1}
         opacity={0.35}
         listening={false}
       />,
     );
   }
 
   for (let y = 0; y <= length; y += step) {
     horizontalLines.push(
       <Line
         key={`h-${y}`}
         points={[0, y * pixelPerMeter, widthPx, y * pixelPerMeter]}
         stroke="#0751ba"
         strokeWidth={1}
         opacity={0.35}
         listening={false}
       />,
     );
   } */

   /* return (
     <>
       {verticalLines}
       {horizontalLines}
     </>
   ); */

   return (
      <Shape
         listening={false}
         perfectDrawEnabled={false}
         sceneFunc={
            (ctx, shape) => {
               const step = 12; // px en coords del layer
               
               const startX = Math.floor(viewX / step) * step;
               const startY = Math.floor(viewY / step) * step;
               ctx.beginPath();
               for (let x = startX; x < viewX + viewW; x += step) {
                  ctx.moveTo(x, viewY);
                  ctx.lineTo(x, viewY + viewH);
               }
               for (let y = startY; y < viewY + viewH; y += step) {
                  ctx.moveTo(viewX, y);
                  ctx.lineTo(viewX + viewW, y);
               }
               ctx.strokeStyle = "rgba(7, 81, 186, 0.35)";
               ctx.lineWidth = 1 / scale;
               ctx.stroke();
            }}
      >

      </Shape>
   );
};
