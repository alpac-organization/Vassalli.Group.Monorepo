import type { PositionItemDto } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/response/sections/get-positions-res";

export type PositionLayout = "lot" | "rack";

export type PositionShapeProps = {
	positions: PositionItemDto[];
	/** Ancho del contenedor (tramo/rack) en metros. */
	containerWidthM: number;
	/** Largo del contenedor (tramo/rack) en metros. */
	containerLengthM: number;
	pixelsPerMeter?: number;
	/** Plantilla de layout para proyectar celdas sin coordenadas. */
	layout?: PositionLayout;
	/** Niveles a mostrar. Default: solo piso (1). `null` = todos. */
	levels?: number[] | null;
};
