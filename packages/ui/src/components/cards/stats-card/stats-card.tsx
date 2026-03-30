import { Fragment } from "react";
import type { StatsCardProps } from "./stats-card.type";
import { TrendingDown, TrendingUp } from "lucide-react";

export const StatsCard = function (props: StatsCardProps): React.ReactElement {
  const { title, value, icon, trend, trendType, borderColor } = props;

  const borderClass =
    borderColor ?? "border-slate-600 hover:border-neutral-600";

  return (
    <Fragment>
      <div
        className={`relative p-6 rounded-lg overflow-hidden border ${borderClass} bg-white dark:bg-[#272b34]`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div
              className="flex 
                            items-center 
                            space-x-2 
                            rtl:space-x-reverse 
                            text-lg! 
                            font-semibold 
                            text-gray-500 
                            dark:text-gray-300"
            >
              <span>{title}</span>
            </div>

            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {icon && (
                <div className="text-gray-500 dark:text-gray-300">{icon}</div>
              )}
            </div>
          </div>

          <div className="text-[20px] text-neutral-900 dark:text-white">
            {value}
          </div>

          {/* border border-slate-600 hover:border-neutral-600 */}
          {trend && (
            <div
              className={`
                                -mx-6 -mb-6 mt-4 
                                px-6 py-6 
                                border-t 
                                ${borderClass}
                                bg-slate-50/50 
                                dark:bg-inherit
                                flex items-center 
                                justify-between 
                                text-sm 
                                font-medium`}
            >
              <span>{trend}</span>
              {trendType === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};
