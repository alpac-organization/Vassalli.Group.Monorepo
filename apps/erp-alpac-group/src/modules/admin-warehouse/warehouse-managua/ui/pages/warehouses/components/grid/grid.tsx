import { Shape } from "react-konva";
import type { GridProps } from "./grid.types";
import type { VisibleViewport } from "../warehouse-shape/warehouse-shape.types";

function getVisibleViewport(
	x: number,
	y: number,
	width: number,
	length: number,
	scale: number,
): VisibleViewport {

	const safeScale = scale > 0 ? scale : 1;

	return {
		viewX: -x / safeScale,
		viewY: -y / safeScale,
		viewW: width / safeScale,
		viewH: length / safeScale,
		scale: safeScale,
	};
}

export const Grid = ({
	x,
	y,
	width,
	length,
	step = 1,
	scale,
	pixelPerMeter }: GridProps) => {

	let pixelStep = step * pixelPerMeter;

	const { viewX, viewY, viewW, viewH, scale: safeScale } = getVisibleViewport(x, y, width, length, scale);

	// Zoom out extremo: menos líneas
	const MAX_LINES = 120;
	while (viewW / pixelStep > MAX_LINES || viewH / pixelStep > MAX_LINES) {
		pixelStep *= 2;
	}

	const pad = pixelStep * 2;
	const startX = Math.floor((viewX - pad) / pixelStep) * pixelStep;
	const endX = viewX + viewW + pad;
	const startY = Math.floor((viewY - pad) / pixelStep) * pixelStep;
	const endY = viewY + viewH + pad;

	return (
		<Shape
			listening={false}
			perfectDrawEnabled={false}
			sceneFunc={(ctx) => {
				ctx.beginPath();
				for (let x = startX; x <= endX; x += pixelStep) {
					ctx.moveTo(x, startY);
					ctx.lineTo(x, endY);
				}
				for (let y = startY; y <= endY; y += pixelStep) {
					ctx.moveTo(startX, y);
					ctx.lineTo(endX, y);
				}
				ctx.strokeStyle = "rgba(75, 85, 99, 0.50)";
				ctx.lineWidth = 1 / safeScale;
				ctx.stroke();
			}}
		/>
	);
};
