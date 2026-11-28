import { Breadcrumb, Tabs, type TabItem } from "@alpac/design-system";
import { RoleEnum } from "@app/core/enums/role.enum";
import { LiquidationsTab } from "@app/modules/payroll/ui/pages/proceso-baja/components/liquidations-tab/liquidations-tab";
import { TerminationsTab } from "@app/modules/payroll/ui/pages/proceso-baja/components/terminations-tab/terminations-tab";
import {
  DEFAULT_PROCESO_BAJA_TAB,
  PROCESO_BAJA_TABS,
  type ProcesoBajaTabId,
} from "@app/modules/payroll/ui/pages/proceso-baja/utils/proceso-baja.constants";
import { useModulePageHeader } from "@app/shared/hooks/useModulePageHeader";
import { useParams } from "@app/shared/hooks/useParams";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m } from "framer-motion";
import { useEffect, useMemo } from "react";

const isProcesoBajaTab = (value: string | null): value is ProcesoBajaTabId =>
  Boolean(value && PROCESO_BAJA_TABS.some((tab) => tab === value));

export const ProcesoBajaPage = () => {
  const { role } = useUserStore();
  const { searchParams, setParam } = useParams();
  const { breadcrumbItems } = useModulePageHeader((baseUrl) => [
    { label: "Dashboard", url: `${baseUrl}/` },
    { label: "Proceso de baja", url: `${baseUrl}/proceso-baja` },
  ]);

  const isAdministrator = role === RoleEnum.ADMINISTRATOR;
  const tabFromUrl = searchParams.get("tab");
  const activeTab = isProcesoBajaTab(tabFromUrl) ? tabFromUrl : DEFAULT_PROCESO_BAJA_TAB;

  useEffect(() => {
    if (!isProcesoBajaTab(tabFromUrl)) {
      setParam("tab", DEFAULT_PROCESO_BAJA_TAB);
    }
  }, [tabFromUrl, setParam]);

  const tabs: TabItem<string>[] = useMemo(
    () => [
      {
        id: "terminations-pending",
        label: "Bajas en proceso",
        render: () => <TerminationsTab mode="pending" />,
      },
      {
        id: "terminations-approved",
        label: "Bajas aprobadas",
        render: () => <TerminationsTab mode="closed" />,
      },
      {
        id: "liquidations-in-progress",
        label: "Liquidaciones en proceso",
        render: () => <LiquidationsTab mode="in-progress" />,
      },
      {
        id: "liquidations-approved",
        label: "Liquidaciones aprobadas",
        render: () => <LiquidationsTab mode="approved" />,
      },
    ],
    [],
  );

  if (!isAdministrator) {
    return (
      <div className="rounded-md border border-slate-200 p-4 text-sm dark:border-neutral-700">
        Solo un administrador puede ver y gestionar el proceso de baja.
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex justify-start">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="m-0! p-0! text-xl font-semibold">Proceso de baja</h2>
        <p className="m-0! text-sm text-slate-500 dark:text-slate-300">
          Gestione bajas y liquidaciones desde un solo lugar.
        </p>
      </div>

      <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
        <Tabs
          tabItems={tabs}
          activeTab={activeTab}
          animation="slide"
          onTabChange={(tabId) => setParam("tab", tabId)}
        />
      </div>
    </m.div>
  );
};
