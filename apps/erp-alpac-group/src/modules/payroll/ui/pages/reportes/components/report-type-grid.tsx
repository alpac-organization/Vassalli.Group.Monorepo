import { CheckCircle } from "lucide-react";
import type { ReportType } from "@app/modules/payroll/domain/ApiContract/Requests/reports-requests/generate-report-request";
import { ReportDetails } from "../types/report-types";
interface ReportTypeGridProps {
  reports: ReportType[];
  selected: ReportType | null;
  onToggleReport: (report: ReportType) => void;
}

export function ReportTypeGrid({
  reports,
  selected,
  onToggleReport,
}: ReportTypeGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {reports.map((report) => {
        const isSelected = selected === report;
        const { icon, name, description } = ReportDetails[report];
        const ReportIcon = icon;
        return (
          <button
            key={report}
            type="button"
            onClick={() => onToggleReport(report)}
            className={[
              "group relative rounded-xl border p-5 text-left transition-all duration-200 dark:bg-[#272b34]",
              isSelected
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                : "border-[#2a3044] bg-[#222738] hover:border-[#3a4560] hover:bg-[#252b3b]",
            ].join(" ")}
          >
            <span className="mb-3 inline-block rounded-full bg-[#2a3044] px-2 py-0.5 text-xs font-medium text-gray-400">
              {name}
            </span>

            <div
              className={[
                "mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-[#2a3044] text-gray-400 group-hover:bg-[#333d54] group-hover:text-gray-200",
              ].join(" ")}
            >
              <ReportIcon size={22} />
            </div>

            <h3
              className={[
                "mb-1 text-base font-semibold",
                isSelected ? "text-white" : "text-gray-100",
              ].join(" ")}
            >
              {name}
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              {description}
            </p>

            {isSelected && (
              <div className="absolute right-4 top-4 text-blue-400">
                <CheckCircle size={18} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
