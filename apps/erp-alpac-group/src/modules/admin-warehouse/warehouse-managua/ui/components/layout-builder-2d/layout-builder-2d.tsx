import { useCallback, useEffect, useMemo, useState } from "react";
import { Layer, Stage } from "react-konva";
import useMeasure from "react-use-measure";
import type { KonvaEventObject } from "konva/lib/Node";
import { DraftConfirmationPopover } from "./components/draft-confirmation-popover";
import { LayoutToolbar } from "./components/layout-toolbar";
import { DraftLayer } from "./layers/draft-layer";
import { EntitiesLayer } from "./layers/entities-layer";
import { GridLayer } from "./layers/grid-layer";
import { METERS_TO_PIXELS } from "./layout-builder-2d.constants";
import type {
  LayoutBuilder2DProps,
  PendingDraft,
  PixelRect,
  ToolMode,
} from "./layout-builder-2d.types";
import {
  defaultCollisionValidator,
  normalizePixelRect,
  pixelRectToSpatialDraft,
  snapToGrid,
  toScreenPosition,
  validateDraftRect,
} from "./layout-builder-2d.utils";

const VIEW_PADDING = 40;
const MIN_SCALE = 0.1;
const MAX_SCALE = 8;
const MIN_PLACEMENT_SIZE_PX = 72;

export type {
  CollisionContext,
  CollisionValidator,
  ExistingEntity,
  LayoutBuilder2DProps,
  LayoutEntityKind,
  PendingDraft,
  SpatialDraft,
} from "./layout-builder-2d.types";

export const LayoutBuilder2D = ({
  containerWidthMetres,
  containerLengthMetres,
  existingEntities = [],
  entityKind,
  draftStorageType = null,
  collisionValidator = defaultCollisionValidator,
  placementDraft = null,
  isSaving = false,
  onPlacementConfirm,
  onPlacementCancel,
}: LayoutBuilder2DProps) => {
  const [ref, bounds] = useMeasure();
  const [tool, setTool] = useState<ToolMode>("pan");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [draftRect, setDraftRect] = useState<PixelRect | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [pendingDraft, setPendingDraft] = useState<PendingDraft | null>(null);
  const [rotationY, setRotationY] = useState(0);

  const collisionContext = useMemo(
    () => ({
      draftStorageType,
      draftKind: entityKind,
      draftPositionY: placementDraft?.position_y ?? 0,
    }),
    [draftStorageType, entityKind, placementDraft?.position_y],
  );

  const evaluateRect = useCallback(
    (rect: PixelRect) =>
      validateDraftRect(
        rect,
        containerWidthMetres,
        containerLengthMetres,
        existingEntities,
        collisionValidator,
        collisionContext,
      ),
    [
      collisionContext,
      collisionValidator,
      containerLengthMetres,
      containerWidthMetres,
      existingEntities,
    ],
  );

  const fitView = useCallback(() => {
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const layoutWidth = containerWidthMetres * METERS_TO_PIXELS;
    const layoutHeight = containerLengthMetres * METERS_TO_PIXELS;
    const nextScale = Math.max(
      MIN_SCALE,
      Math.min(
        (bounds.width - VIEW_PADDING) / layoutWidth,
        (bounds.height - VIEW_PADDING) / layoutHeight,
        2,
      ),
    );

    setScale(nextScale);
    setPosition({
      x: (bounds.width - layoutWidth * nextScale) / 2,
      y: (bounds.height - layoutHeight * nextScale) / 2,
    });
  }, [
    bounds.height,
    bounds.width,
    containerLengthMetres,
    containerWidthMetres,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fitView, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fitView]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (!placementDraft || bounds.width <= 0 || bounds.height <= 0) {
        setTool("pan");
        setDraftRect(null);
        setPendingDraft(null);
        setRotationY(0);
        return;
      }

      const width = placementDraft.width_metres * METERS_TO_PIXELS;
      const height = placementDraft.length_metres * METERS_TO_PIXELS;
      const x = snapToGrid(
        (containerWidthMetres * METERS_TO_PIXELS - width) / 2,
      );
      const y = snapToGrid(
        (containerLengthMetres * METERS_TO_PIXELS - height) / 2,
      );
      const nextRect = { x, y, width, height };
      const fitScale = Math.min(
        (bounds.width - VIEW_PADDING) /
          (containerWidthMetres * METERS_TO_PIXELS),
        (bounds.height - VIEW_PADDING) /
          (containerLengthMetres * METERS_TO_PIXELS),
      );
      const visibilityScale =
        MIN_PLACEMENT_SIZE_PX / Math.max(1, Math.min(width, height));
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, fitScale, visibilityScale),
      );

      setTool("place");
      setRotationY(placementDraft.rotation_y ?? 0);
      setPendingDraft(null);
      setDraftRect(nextRect);
      setIsValid(evaluateRect(nextRect));
      setScale(nextScale);
      setPosition({
        x: bounds.width / 2 - (x + width / 2) * nextScale,
        y: bounds.height / 2 - (y + height / 2) * nextScale,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    bounds.height,
    bounds.width,
    containerLengthMetres,
    containerWidthMetres,
    evaluateRect,
    placementDraft,
  ]);

  const clearPlacement = useCallback(() => {
    setDraftRect(null);
    setPendingDraft(null);
    setIsValid(true);
    setRotationY(0);
    setTool("pan");
  }, []);

  const handleDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (tool !== "place" || !draftRect) return;

      const snappedX = snapToGrid(e.target.x());
      const snappedY = snapToGrid(e.target.y());

      const updatedRect = {
        ...draftRect,
        x: snappedX,
        y: snappedY,
      };

      setDraftRect(updatedRect);
      setIsValid(evaluateRect(updatedRect));
      e.target.x(snappedX);
      e.target.y(snappedY);
    },
    [tool, draftRect, evaluateRect]
  );

  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      if (tool !== "place" || !draftRect) return;

      const snappedX = snapToGrid(e.target.x());
      const snappedY = snapToGrid(e.target.y());

      const updatedRect = {
        ...draftRect,
        x: snappedX,
        y: snappedY,
      };

      const spatialDraft = pixelRectToSpatialDraft(updatedRect);
      spatialDraft.position_y = placementDraft?.position_y ?? 0;
      spatialDraft.rotation_y = rotationY;

      const normalized = normalizePixelRect(updatedRect);
      const valid = evaluateRect(updatedRect);

      setDraftRect(updatedRect);
      setIsValid(valid);
      if (valid) {
        setTool("pan");
        setPendingDraft({
          draft: spatialDraft,
          screenPosition: {
            x: Math.min(
              Math.max(
                toScreenPosition(normalized, position, scale).x,
                120,
              ),
              Math.max(120, bounds.width - 120),
            ),
            y: Math.min(
              Math.max(
                toScreenPosition(normalized, position, scale).y,
                90,
              ),
              Math.max(90, bounds.height - 90),
            ),
          },
        });
      }
    },
    [
      bounds.height,
      bounds.width,
      draftRect,
      evaluateRect,
      position,
      placementDraft?.position_y,
      rotationY,
      scale,
      tool,
    ],
  );

  const handleRotate = useCallback(() => {
    if (!draftRect || pendingDraft) return;

    const centerX = draftRect.x + draftRect.width / 2;
    const centerY = draftRect.y + draftRect.height / 2;
    const rotatedRect = {
      x: snapToGrid(centerX - draftRect.height / 2),
      y: snapToGrid(centerY - draftRect.width / 2),
      width: draftRect.height,
      height: draftRect.width,
    };

    setRotationY((current) => (current + 90) % 180);
    setDraftRect(rotatedRect);
    setIsValid(evaluateRect(rotatedRect));
  }, [draftRect, evaluateRect, pendingDraft]);

  const handleConfirmDraft = () => {
    if (!pendingDraft || !isValid || isSaving) {
      return;
    }

    onPlacementConfirm(pendingDraft.draft);
  };

  const handleCancelDraft = () => {
    setPendingDraft(null);
    setTool("place");
  };

  const handleCancelPlacement = () => {
    clearPlacement();
    onPlacementCancel?.();
  };

  const zoomAtCenter = useCallback(
    (factor: number) => {
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, scale * factor),
      );
      const worldCenter = {
        x: (bounds.width / 2 - position.x) / scale,
        y: (bounds.height / 2 - position.y) / scale,
      };

      setScale(nextScale);
      setPosition({
        x: bounds.width / 2 - worldCenter.x * nextScale,
        y: bounds.height / 2 - worldCenter.y * nextScale,
      });
    },
    [bounds.height, bounds.width, position.x, position.y, scale],
  );

  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    const stage = event.target.getStage();
    if (!stage) {
      return;
    }

    const scaleBy = 1.1;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) {
      return;
    }

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(
        MIN_SCALE,
        event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy,
      ),
    );

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const activeDraftRect = pendingDraft
    ? {
        x: pendingDraft.draft.position_x * METERS_TO_PIXELS,
        y: pendingDraft.draft.position_z * METERS_TO_PIXELS,
        width: pendingDraft.draft.width_metres * METERS_TO_PIXELS,
        height: pendingDraft.draft.length_metres * METERS_TO_PIXELS,
      }
    : draftRect;

  return (
    <div
      className="relative h-[min(70vh,680px)] min-h-[420px] w-full touch-none overflow-hidden rounded-md border border-slate-600 bg-slate-900 dark:border-neutral-600"
      ref={ref}
    >
      <LayoutToolbar
        tool={tool}
        onToolChange={setTool}
        isPlacementActive={Boolean(placementDraft)}
        onRotate={handleRotate}
        onZoomIn={() => zoomAtCenter(1.25)}
        onZoomOut={() => zoomAtCenter(0.8)}
        onFit={fitView}
        onCancelPlacement={handleCancelPlacement}
      />

      {bounds.width > 0 ? (
        <Stage
          width={bounds.width}
          height={bounds.height}
          onWheel={handleWheel}
          draggable={tool === "pan" && !pendingDraft}
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
          onDragEnd={(event) => {
            if (tool === "pan") {
              setPosition({ x: event.target.x(), y: event.target.y() });
            }
          }}
          style={{ cursor: tool === "pan" ? "grab" : "move" }}
        >
          <Layer listening={false}>
            <GridLayer
              containerWidthMetres={containerWidthMetres}
              containerLengthMetres={containerLengthMetres}
              scale={scale}
            />
          </Layer>

          <Layer listening={false}>
            <EntitiesLayer entities={existingEntities} scale={scale} />
          </Layer>

          <Layer listening={tool === "place" && !pendingDraft}>
            <DraftLayer
              draftRect={activeDraftRect}
              isValid={isValid}
              scale={scale}
              pointerPosition={null}
              tool={tool}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </Layer>
        </Stage>
      ) : null}

      {!placementDraft ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 mx-auto max-w-md rounded-md border border-slate-700 bg-slate-800/90 px-4 py-3 text-center text-sm text-slate-300 shadow-lg">
          Use el botón <strong>Añadir</strong>, configure las medidas y después
          arrastre el objeto a su posición exacta.
        </div>
      ) : !isValid && !pendingDraft ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 mx-auto max-w-md rounded-md border border-red-500/40 bg-red-950/90 px-4 py-3 text-center text-sm text-red-200 shadow-lg">
          {(placementDraft?.position_y ?? 0) > 0
            ? "Sección elevada: colóquela completamente dentro de una sección de Tramos (naranja). Puede compartir espacio con otros racks elevados."
            : "Posición no válida. Mueva el objeto dentro del área disponible y sin colisiones."}
        </div>
      ) : null}

      {pendingDraft ? (
        <DraftConfirmationPopover
          pendingDraft={pendingDraft}
          isValid={isValid}
          isSaving={isSaving}
          onConfirm={handleConfirmDraft}
          onCancel={handleCancelDraft}
        />
      ) : null}
    </div>
  );
};
