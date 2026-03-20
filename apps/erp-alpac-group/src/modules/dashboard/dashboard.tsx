import { useTheme } from "@alpac/design-system";
import { DashBoardCard } from "../../../../../packages/ui/src/components/cardDashboard/DashboardCard";
import { templatesData } from "./data/templates.data";
import { useId } from "react";

export const Dashboard = function () {
  const { theme } = useTheme();
  const uniqueId = useId();
  return (
    <div
      className={`p-8 w-full min-h-screen ${theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-100"}`}
    >
      <div className="mb-8 flex justify-center">
        <h1
          className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Dashboard Templates
        </h1>
      </div>

      <div className="w-full max-w-300 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {templatesData.map((template, index) => (
          <DashBoardCard
            id={uniqueId}
            key={index}
            title={template.title}
            image={template.image}
            onClick={() => console.log("testing card")}
          />
        ))}
      </div>
    </div>
  );
};
