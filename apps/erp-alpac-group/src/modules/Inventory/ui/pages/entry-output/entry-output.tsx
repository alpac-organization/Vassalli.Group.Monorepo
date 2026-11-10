import { useEffect } from "react";
import { SectionHeader, Tabs } from "@alpac/design-system";

import { useParams } from "@app/shared/hooks/useParams";
import { GetSectionViewsToEntryOutput } from "./entry-output.variants";

export const EntryOutput = function () {
  const { setParam, searchParams } = useParams();
  const tabsItems = GetSectionViewsToEntryOutput();

  const tabFromUrl = searchParams.get("tab");

  const isValidTab = tabsItems.some((item) => item.id === tabFromUrl);

  const activeTab = isValidTab ? tabFromUrl! : "entradas";

  useEffect(() => {
    if (!isValidTab) {
      setParam("tab", "entradas");
    }
  }, [isValidTab, setParam]);

  const handleTabChange = (tabId: string) => {
    setParam("tab", tabId);
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Entradas y salidas"
        subtitle="Consulta las entradas y salidas de inventario."
      />

      <Tabs activeTab={activeTab} tabItems={tabsItems} onTabChange={handleTabChange} />
    </div>
  );
};