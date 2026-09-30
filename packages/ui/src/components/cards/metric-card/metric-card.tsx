import { Fragment } from "react";
import type { MetricCardProps } from "./metric-card.type";

export const MetricCard = function (props: MetricCardProps): React.ReactElement {
  const {
    title,
    value,
    trend,
    icon,
    themeClass = "bg-blue-500",
    size = "default",
    className = "",
  } = props;

  // Tomamos solo la primera clase (e.g. bg-blue-500) para el borde o ícono
  const accentColor = themeClass.split(" ")[0] ?? "bg-blue-500";
  const iconColor = accentColor.replace("bg-", "text-");

  if (size === "compact") {
    return (
      <div
        className={`rounded-lg border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#1b1e27] p-3 transition-colors ${className}`}
      >
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {icon && <div className={`shrink-0 ${iconColor}`}>{icon}</div>}
          <span className="truncate">{title}</span>
        </div>
        <p
          className="mt-1 text-sm font-semibold text-slate-900 dark:text-white truncate"
          title={value}
        >
          {value}
        </p>
        {trend && (
          <p
            className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate"
            title={trend}
          >
            {trend}
          </p>
        )}
      </div>
    );
  }

  return (
    <Fragment>
      <div
        className={`relative flex flex-col bg-white dark:bg-[#232732] rounded-lg border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden hover:bg-slate-50 dark:hover:bg-[#282d3a] transition-all h-full ${className}`}
      >
        {/* Borde izquierdo */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`} />

        <div className="p-5 pl-7 flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <span className="text-xs[11px]! font-semibold text-slate-500 dark:text-gray-300 leading-snug line-clamp-2 min-h-5 pr-2">
                {title}
              </span>
              {icon && (
                <div className={`shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>
              )}
            </div>

            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              {value}
            </div>
          </div>

          {trend && (
            <p
              className="text-xs text-slate-500 dark:text-gray-500 mt-2 truncate"
              title={trend}
            >
              {trend}
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

