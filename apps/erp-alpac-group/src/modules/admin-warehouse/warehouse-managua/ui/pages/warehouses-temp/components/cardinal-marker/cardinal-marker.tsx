import { Arrow, Group, Text } from "react-konva";
import { CardinalRotation, type CardinalMarkerProps } from "./cardinal-market.types";

export const CardinalMarker = ({ x, y, cardinality = 'S' , size = 60 }: CardinalMarkerProps) => {

   return (
      <Group x={x} y={y} rotation={CardinalRotation[cardinality]}>
         <Arrow
            points={[0, size / 2, 0, -size / 2]}
            pointerLength={8}
            pointerWidth={8}
            stroke="#38bdf8"
            fill="#38bdf8"
            strokeWidth={2}
         />
         <Text text="N" x={-6} y={-size / 2 - 14} fontSize={12} fill="#e2e8f0" />
         <Text text="S" x={-5} y={size / 2 + 2} fontSize={11} fill="#94a3b8" />
         <Text text="O" x={-size / 2 - 12} y={-6} fontSize={11} fill="#94a3b8" />
         <Text text="E" x={size / 2 + 4} y={-6} fontSize={11} fill="#94a3b8" />
      </Group>
   );
}