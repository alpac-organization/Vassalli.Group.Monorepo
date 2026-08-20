import { Fragment } from "react";
import type { MetricCardProps } from "./metric-card.type";

export const MetricCard = function (props: MetricCardProps): React.ReactElement {
  const { title, value, trend, icon, themeClass = "bg-blue-500" } = props;

  // Tomamos solo la primera clase (e.g. bg-blue-500) para el borde izquierdo
  const accentColor = themeClass.split(" ")[0];
  const iconColor = accentColor.replace("bg-", "text-");

  return (
    <Fragment>
      <div className="relative flex flex-col bg-white dark:bg-[#232732] rounded-lg border border-slate-200 dark:border-gray-800 shadow-sm overflow-hidden hover:bg-slate-50 dark:hover:bg-[#282d3a] transition-all h-full">
        {/* Borde izquierdo */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`}></div>
        
        <div className="p-5 pl-7 flex flex-col h-full justify-between">
          
          <div>
            <div className="flex justify-between items-start gap-4 mb-3">
              <span className="text-xs[11px]! font-semibold text-slate-500 dark:text-gray-300 leading-snug line-clamp-2 min-h-5 pr-2">
                {title}
              </span>
              {icon && (
                <div className={`shrink-0 mt-0.5 ${iconColor}`}>
                  {icon}
                </div>
              )}
            </div>
            
            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{value}</div>
          </div>
          
          {trend && (
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-2 truncate" title={trend}>
              {trend}
            </p>
          )}

        </div>
      </div>
    </Fragment>
  );
};
