import { Breadcrumb, Tabs, type TabItem } from "@alpac/design-system";
import { DisciplinaryPageHeader } from "@app/modules/payroll/ui/pages/disciplinary-management/components/disciplinary-page-header/disciplinary-page-header";
import { FaultsTab } from "@app/modules/payroll/ui/pages/disciplinary-management/components/faults-tab/faults-tab";
import { SanctionsTab } from "@app/modules/payroll/ui/pages/disciplinary-management/components/sanctions-tab/sanctions-tab";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const DisciplinaryManagementPage = () => {
  const navigate = useNavigate();
  const { baseUrl } = useBaseUrl();

  const tabs: TabItem<string>[] = [
    {
      id: "faults",
      label: "Faltas",
      render: () => <FaultsTab canWrite />,
    },
    {
      id: "sanctions",
      label: "Sanciones",
      render: () => <SanctionsTab />,
    },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
    >
      <div className="flex justify-start">
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              url: `${baseUrl}/`,
              onClick: (url) => navigate(url),
            },
            {
              label: "Gestión Disciplinaria",
              url: `${baseUrl}/gestion-disciplinaria`,
              onClick: (url) => navigate(url),
            },
          ]}
        />
      </div>

      <DisciplinaryPageHeader />

      <div className="relative mx-auto w-full rounded-xl border border-slate-200 bg-white p-4 dark:border-neutral-700 dark:bg-[#272B34]">
        <Tabs tabItems={tabs} activeTab="faults" animation="slide" />
      </div>
    </m.div>
  );
};
