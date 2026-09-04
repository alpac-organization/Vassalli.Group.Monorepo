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
  isValidDrawSize,
  normalizePixelRect,
  pixelRectToSpatialDraft,
  snapToGrid,
  toScreenPosition,
  validateDraftRect,
} from "./layout-builder-2d.utils";

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
  showStorageTypeSelector = false,
  storageTypeOptions = [],
  onDraftStorageTypeChange,
  collisionValidator = defaultCollisionValidator,
  onDrawComplete,
}: LayoutBuilder2DProps) => {
  const [ref, bounds] = useMeasure();
  const [tool, setTool] = useState<ToolMode>("draw");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isDrawing, setIsDrawing] = useState(false);
  const [draftRect, setDraftRect] = useState<PixelRect | null>(null);
  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [pendingDraft, setPendingDraft] = useState<PendingDraft | null>(null);

  const collisionContext = useMemo(
    () => ({
      draftStorageType,
      draftKind: entityKind,
    }),
    [draftStorageType, entityKind],
  );

  useEffect(() => {
    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const layoutPixelWidth = containerWidthMetres * METERS_TO_PIXELS;
    const layoutPixelHeight = containerLengthMetres * METERS_TO_PIXELS;
    const scaleX = (bounds.width - 40) / layoutPixelWidth;
    const scaleY = (bounds.height - 40) / layoutPixelHeight;
    const initialScale = Math.min(scaleX, scaleY, 2);

    const timeoutId = window.setTimeout(() => {
      setScale(initialScale);
      setPosition({
        x: (bounds.width - layoutPixelWidth * initialScale) / 2,
        y: (bounds.height - layoutPixelHeight * initialScale) / 2,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [bounds.width, bounds.height, containerWidthMetres, containerLengthMetres]);

  const getPointerPosition = useCallback(
    (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
      const stage = event.target.getStage();
      if (!stage) {
        return null;
      }

      const pointer = stage.getPointerPosition();
      if (!pointer) {
        return null;
      }

      return {
        x: (pointer.x - position.x) / scale,
        y: (pointer.y - position.y) / scale,
      };
    },
    [position.x, position.y, scale],
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

  const resetDraftState = useCallback(() => {
    setIsDrawing(false);
    setDraftRect(null);
    setPointerPosition(null);
    setPendingDraft(null);
    setIsValid(true);
  }, []);

  const handlePointerDown = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (tool !== "draw" || pendingDraft) {
      return;
    }

    const pointer = getPointerPosition(event);
    if (!pointer) {
      return;
    }

    setIsDrawing(true);
    setDraftRect({
      x: snapToGrid(pointer.x),
      y: snapToGrid(pointer.y),
      width: 0,
      height: 0,
    });
    setPointerPosition(pointer);
    setIsValid(true);
  };

  const handlePointerMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const pointer = getPointerPosition(event);
    if (!pointer) {
      return;
    }

    if (!isDrawing || !draftRect || tool !== "draw") {
      return;
    }

    const snappedX = snapToGrid(pointer.x);
    const snappedY = snapToGrid(pointer.y);
    const updatedRect: PixelRect = {
      ...draftRect,
      width: snappedX - draftRect.x,
      height: snappedY - draftRect.y,
    };

    setDraftRect(updatedRect);
    setPointerPosition(pointer);
    setIsValid(evaluateRect(updatedRect));
  };

  const handlePointerUp = () => {
    if (!isDrawing || !draftRect) {
      return;
    }

    setIsDrawing(false);

    if (!isValidDrawSize(draftRect)) {
      resetDraftState();
      return;
    }

    const spatialDraft = pixelRectToSpatialDraft(draftRect);
    const normalized = normalizePixelRect(draftRect);
    const valid = evaluateRect(draftRect);

    setIsValid(valid);
    setPendingDraft({
      draft: spatialDraft,
      screenPosition: toScreenPosition(normalized, position, scale),
    });
  };

  const handleConfirmDraft = () => {
    if (!pendingDraft || !isValid) {
      return;
    }

    onDrawComplete(pendingDraft.draft);
    resetDraftState();
  };

  const handleCancelDraft = () => {
    resetDraftState();
  };

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

    const newScale = event.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

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
      className="relative h-[500px] w-full overflow-hidden rounded-md border border-slate-600 bg-slate-900 dark:border-neutral-600"
      ref={ref}
    >
      <LayoutToolbar
        tool={tool}
        onToolChange={setTool}
        showStorageTypeSelector={showStorageTypeSelector}
        storageTypeOptions={storageTypeOptions}
        draftStorageType={draftStorageType}
        onDraftStorageTypeChange={onDraftStorageTypeChange}
        isDrawingDisabled={Boolean(pendingDraft)}
      />

      {bounds.width > 0 ? (
        <Stage
          width={bounds.width}
          height={bounds.height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
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
          style={{ cursor: tool === "pan" ? "grab" : "crosshair" }}
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

          <Layer listening={false}>
            <DraftLayer
              draftRect={activeDraftRect}
              isValid={isValid}
              scale={scale}
              pointerPosition={isDrawing ? pointerPosition : null}
            />
          </Layer>
        </Stage>
      ) : null}

      {pendingDraft ? (
        <DraftConfirmationPopover
          pendingDraft={pendingDraft}
          isValid={isValid}
          onConfirm={handleConfirmDraft}
          onCancel={handleCancelDraft}
        />
      ) : null}
    </div>
  );
};
