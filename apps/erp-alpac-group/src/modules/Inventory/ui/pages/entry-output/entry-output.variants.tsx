import type { TabItem } from "@alpac/design-system";
import { Entradas } from "./components/entradas/entradas";
import { Salidas } from "./components/salidas/salidas";

export const GetSectionViewsToEntryOutput = function (): TabItem<string>[] {
  return [
    {
      id: "entradas",
      label: "Entradas",
      render: () => <Entradas />,
    },
    {
      id: "salidas",
      label: "Salidas",
      render: () => <Salidas />,
    },
  ];
};