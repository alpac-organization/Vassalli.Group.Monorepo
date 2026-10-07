export type Bounds = {
   x: number;
   y: number;
   width: number;
   length: number;
}

export type TargetArea = {
   width: number;
   length: number;
   marginTop: number;
   marginBottom: number;
   marginLeft: number;
   marginRight: number;
}

export const isInsideAvailableArea = (sourceBound: Bounds, targetArea: TargetArea): boolean => {
   const minX = targetArea.marginLeft;
   const minY = targetArea.marginTop;
   const maxX = targetArea.width - targetArea.marginRight;
   const maxY = targetArea.length - targetArea.marginBottom;
   const sectionMaxX = sourceBound.x + sourceBound.width;
   const sectionMaxY = sourceBound.y + sourceBound.length;

   return (
      sourceBound.x >= minX &&
      sourceBound.y >= minY &&
      sectionMaxX <= maxX &&
      sectionMaxY <= maxY
   );
}