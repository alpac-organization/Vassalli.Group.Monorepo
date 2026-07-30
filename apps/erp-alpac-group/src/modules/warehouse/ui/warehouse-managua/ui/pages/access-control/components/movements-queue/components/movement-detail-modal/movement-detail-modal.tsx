import { useMemo } from "react";
import {
  Badges,
  Button,
  Modal,
  Tabs,
  type TabItem,
} from "@alpac/design-system";
import { DetailField } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-field/detail-field";
import { DetailSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/detail-section/detail-section";
import { DucatList } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/components/ducat-list/ducat-list";
import type { MovementDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/types/movement-detail.types";
import {
  getStatusBadgeClass,
  getStatusBadgeLabel,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/utils/movements.utils";
import { formatDate, formatTime } from "@app/shared/utils/string.utils";
import type { RecordEntrance } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import { ConsolidatedVariations } from "./variants/global-variants";

type DetailTabId = "resumen" | "ducats";

function ResumenTabContent({ movement }: { movement: RecordEntrance }) {
  const entrance = movement.reception_entrance;
  const log = movement.execution_log;

  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
      <DetailSection title="Resumen">
        <div className="min-w-0 flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-1.5">
          <p className="m-0! shrink-0 text-xs tracking-wide text-slate-500 dark:text-slate-400">
            Estado:
          </p>
          <Badges
            label={getStatusBadgeLabel(movement.status)}
            color="transparent"
            className={getStatusBadgeClass(movement.status)}
          />
        </div>

        <DetailField
          label="Hora Inicial registro"
          value={formatTime(log?.start_time)}
        />

        <DetailField
          label="Hora final registro"
          value={formatTime(log?.end_time)}
        />

        <div className="min-w-0 flex flex-row items-center justify-between gap-3 sm:flex-col sm:items-start sm:gap-1.5">
          <p className="m-0! shrink-0 text-xs tracking-wide text-slate-500 dark:text-slate-400">
            ¿Es consolidado?
          </p>

          <Badges
            label={
              movement.is_consolidated
                ? ConsolidatedVariations.consolidated.label
                : ConsolidatedVariations.Unbound.label
            }
            color={
              movement.is_consolidated
                ? ConsolidatedVariations.consolidated.color
                : ConsolidatedVariations.Unbound.color
            }
          />
        </div>
      </DetailSection>

      <DetailSection title="Identificación">
        <DetailField
          label="Placa cabezal"
          value={entrance?.plate_number || "—"}
        />

        <DetailField
          label="Fecha de registro"
          value={log?.start_date ? formatDate(log.start_date) : "—"}
        />

        <DetailField
          label="Trailer chasis"
          value={entrance?.trailer_chassis || "—"}
        />
      </DetailSection>

      <DetailSection title="Información del conductor">
        <DetailField label="Conductor" value={entrance?.driver_name || "—"} />

        <DetailField
          label="Licencia de conductor"
          value={entrance?.driver_license || "—"}
        />

        <DetailField
          label="Medio de transporte"
          value={entrance?.medio || "—"}
        />

        <DetailField
          label="Transportista"
          value={entrance?.transportista || "—"}
        />
      </DetailSection>
    </div>
  );
}

function DucatsTabContent({ items }: { items: string[] }) {
  return (
    <DetailSection title="Documentos DUCAT">
      <DucatList items={items} />
    </DetailSection>
  );
}

export function MovementDetailModal({
  isOpen,
  movement,
  onClose,
}: MovementDetailModalProps) {
  const ducatNumbers = useMemo(
    () =>
      movement?.ducats?.map((ducat) => ducat.ducat_number).filter(Boolean) ??
      [],
    [movement?.ducats],
  );
  const ducatCount = ducatNumbers.length;

  const tabItems = useMemo<TabItem<DetailTabId>[]>(() => {
    if (!movement) return [];

    return [
      {
        id: "resumen",
        label: "Resumen",
        render: () => <ResumenTabContent movement={movement} />,
      },
      {
        id: "ducats",
        label: `Documentos Ducat (${ducatCount})`,
        render: () => <DucatsTabContent items={ducatNumbers} />,
      },
    ];
  }, [movement, ducatCount, ducatNumbers]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del movimiento"
      variant="info"
      size="3xl"
    >
      {movement ? (
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden p-1 sm:p-2">
            <Tabs
              key={movement.id}
              tabItems={tabItems as TabItem<string>[]}
              activeTab="resumen"
            />
          </div>

          <div className="shrink-0 sticky bottom-0 z-10 bg-white dark:bg-[#272b34] flex justify-end pt-3 sm:pt-4 border-t border-slate-200 dark:border-neutral-600 -mx-1 px-1 sm:-mx-2 sm:px-2">
            <Button
              type="button"
              size="medium"
              label="Cerrar"
              ariaLabel="Cerrar detalle"
              onClick={onClose}
              className="w-full sm:w-auto text-[13px]! text-white! bg-slate-500! dark:bg-slate-700! hover:bg-slate-600! dark:hover:bg-slate-600!"
            />
          </div>
        </div>
      ) : (
        <div className="min-h-30" />
      )}
    </Modal>
  );
}
