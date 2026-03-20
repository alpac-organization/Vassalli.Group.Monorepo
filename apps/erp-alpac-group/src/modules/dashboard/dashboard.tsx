import { useTheme } from "@alpac/design-system";
import { DashBoardCard } from "../../../../../packages/ui/src/components/cardDashboard/DashboardCard";
import { templatesData } from "./data/templates.data";

export const Dashboard = function () {
  const { theme } = useTheme();

  return (
    <div
      className={`p-8 w-full min-h-screen ${theme === "dark" ? "bg-[#0f0f0f]" : "bg-gray-100"}`}
    >
      <div className="mb-8">
        <h1
          className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Dashboard Templates
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {templatesData.map((template, index) => (
          <DashBoardCard
            key={index}
            title={template.title}
            image={template.image}
          />
        ))}
      </div>
    </div>
  );
};
