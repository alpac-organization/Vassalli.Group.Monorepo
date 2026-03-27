import { Fragment } from "react";
import type { StatsCardProps } from "./stats-card.type";

export const StatsCard = function (props: StatsCardProps): React.ReactElement {
    const { title, value, icon } = props;

    return (
        <Fragment>
            <div className="relative p-6 rounded-lg border border-slate-600 hover:border-neutral-600 bg-white dark:bg-[#272b34]">
                <div className="space-y-2">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500 dark:text-gray-400">
                            <span>{title}</span>
                        </div>

                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            {
                                icon && (
                                    <div className="text-gray-500 dark:text-gray-300">
                                        {icon}
                                    </div>
                                )

                            }
                        </div>
                    </div>

                    <div className="text-[20px] text-neutral-900 dark:text-white">
                        {value}
                    </div>

                    <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium text-red-700 dark:text-red-400">

                        <span>3% decrease</span>

                    </div>
                </div>

            </div>
        </Fragment>
    )
}