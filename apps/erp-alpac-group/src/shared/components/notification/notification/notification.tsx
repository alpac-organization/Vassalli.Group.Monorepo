import type { NotificationProps } from "@app/shared/components/notification/notification/notification.type";

export const Notification = ({ title, description, date, time }: NotificationProps) => {
   return (
      <div className="dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600 mb-3 flex flex-col gap-1">
         <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-800 dark:text-white">{title}</span>
            <span className="text-[11px] text-slate-400 dark:text-neutral-500">{time}</span>
         </div>

         <p className="text-xs text-slate-600 dark:text-gray-400 m-0!">{description}</p>

         <span className="text-[10px] text-slate-400 dark:text-neutral-500 text-right mt-1">
            {date}
         </span>
      </div>
   );
};