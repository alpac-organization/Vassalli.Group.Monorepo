type Cardinal = "N" | "E" | "S" | "O";

export interface CardinalMarkerProps {
   x: number;
   y: number;
   cardinality?: Cardinal;
   size?: number
}

export const CardinalRotation: Record<Cardinal, number> = {
   N: 0,
   E: 90,
   S: 180,
   O: 270,
};