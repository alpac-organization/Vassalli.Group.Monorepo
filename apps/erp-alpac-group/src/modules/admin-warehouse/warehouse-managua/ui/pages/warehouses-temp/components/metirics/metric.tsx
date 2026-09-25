import { Arrow, Group, Label, Line, Tag, Text } from "react-konva";
import type { HorizontalMetricProps, VerticalMetricProps } from "./metric.types";

export const METRIC_SIZE = 40;

export const VerticalMetric = ({ x, y, length, pixelPerMeter }: VerticalMetricProps) => {

   const pixelLength = pixelPerMeter != 0 ? (length / pixelPerMeter) : length;

   return (
      <Group x={x} y={y}>
         <Arrow
            points={[METRIC_SIZE / 2, 0, METRIC_SIZE / 2, length]}
            stroke="#94a3b8"
            fill="#94a3b8"
            pointerAtBeginning
         />
         <Line points={[0, 0, METRIC_SIZE, 0]} stroke="#94a3b8" />
         <Line points={[0, length, METRIC_SIZE, length]} stroke="#94a3b8" />
         <Label x={METRIC_SIZE / 2 - 50} y={length / 2}>
            <Tag fill="#1e293b" stroke="#64748b" />
            <Text fill="white" text={(pixelLength) + " m"} padding={10} />
         </Label>
      </Group>
   );
}

export const HorizontalMetric = ({ x, y, width, pixelPerMeter }: HorizontalMetricProps) => {

   const pixelWidth = pixelPerMeter != 0 ? (width / pixelPerMeter) : width;

   return (
      <Group x={x} y={y}>
         <Arrow
            points={[0, METRIC_SIZE / 2, width, METRIC_SIZE / 2]}
            stroke="#94a3b8"
            fill="#94a3b8"
            pointerAtBeginning
         />
         <Line points={[0, 0, 0, METRIC_SIZE]} stroke="#94a3b8" />
         <Line points={[width, 0, width, METRIC_SIZE]} stroke="#94a3b8" />
         <Label x={width / 2} y={0}>
            <Tag fill="#1e293b" stroke="#64748b" />
            <Text fill="white" text={(pixelWidth) + " m"} padding={10} />
         </Label>
      </Group>
   );
}