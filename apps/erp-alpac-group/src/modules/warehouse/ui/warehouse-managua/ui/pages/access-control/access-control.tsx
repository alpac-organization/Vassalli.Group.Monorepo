import { m } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import type { EnumType } from "@app/shared/types/enum.type";
import { AccessControlHeader } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-header/access-control-header";
import { AccessControlStats } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-stats/access-control-stats";
import { AccessControlActions } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-actions/access-control-actions";
import { AccessControlFiltersBar } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/access-control-filters/access-control-filters";
import { MovementsQueue } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/movements-queue";
import { GateEntryModal } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/gate-entry-modal";
import type { GateEntryFormValues } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { MOCK_MOVEMENTS } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/mock/movements.mock";
import type {
  AccessControlFilters,
  MovementQueueItem,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/types/movement.types";
import {
  filterMovements,
  getAccessControlMetrics,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/utils/filter-movements";

const EMPTY_FILTERS: AccessControlFilters = {
  ducaNumero: "",
  placaCabezal: "",
  conductor: "",
};

function mapFormToMovement(data: GateEntryFormValues): MovementQueueItem {
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const entry = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const firstDuca =
    data.ducas.find((duca) => duca.value.trim())?.value.trim() ||
    `DUCA-T-2026-${randomId}`;

  return {
    id: crypto.randomUUID(),
    serviceOrder: `OS-MGA-2026-${randomId}`,
    ducaNumero: firstDuca,
    placaCabezal: data.plateNumber.toUpperCase(),
    driver: data.driverName,
    consignee: data.consignee || "Consignatario General S.A.",
    entry,
    status: "PENDIENTE",
  };
}

export function AccessControlPage() {
  const [filters, setFilters] = useState<AccessControlFilters>(EMPTY_FILTERS);
  const [movements, setMovements] =
    useState<MovementQueueItem[]>(MOCK_MOVEMENTS);
  const [isGateEntryOpen, setIsGateEntryOpen] = useState(false);

  const plateOptions = useMemo<EnumType[]>(
    () =>
      movements.map((item) => ({
        label: item.placaCabezal,
        value: item.placaCabezal,
      })),
    [movements],
  );

  const conductorOptions = useMemo<EnumType[]>(() => {
    const seen = new Set<string>();
    return movements.reduce<EnumType[]>((options, item) => {
      if (seen.has(item.driver)) return options;
      seen.add(item.driver);
      options.push({ label: item.driver, value: item.driver });
      return options;
    }, []);
  }, [movements]);

  const filteredMovements = useMemo(
    () => filterMovements(movements, filters),
    [movements, filters],
  );

  const metrics = useMemo(
    () => getAccessControlMetrics(movements),
    [movements],
  );

  const handleGateEntrySubmit = useCallback((data: GateEntryFormValues) => {
    setMovements((prev) => [mapFormToMovement(data), ...prev]);
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-6 min-w-0 w-full"
    >
      <AccessControlHeader />

      <AccessControlStats metrics={metrics} />

      <AccessControlActions onGiveEntry={() => setIsGateEntryOpen(true)} />

      <AccessControlFiltersBar
        plateOptions={plateOptions}
        conductorOptions={conductorOptions}
        onApply={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <MovementsQueue data={filteredMovements} onDetailClick={() => {}} />

      <GateEntryModal
        isOpen={isGateEntryOpen}
        onClose={() => setIsGateEntryOpen(false)}
        onSubmit={handleGateEntrySubmit}
      />
    </m.div>
  );
}
