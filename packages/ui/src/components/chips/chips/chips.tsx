import { XIcon } from "lucide-react";
import { ChipProps } from "./chips.type";

export const Chips = ({label, onClick, ...rest}: ChipProps) => {

   return (
      <span
         {...rest}
         className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[13px] font-medium text-slate-700 dark:border-slate-600 dark:bg-[#1f232b] dark:text-slate-200"
      >
         {label}
         <button
            type="button"
            aria-label={`chips ${label}`}
            onClick={onClick}
            className="inline-flex h-4 w-4 items-center justify-center rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
         >
            <XIcon size={12} />
         </button>
      </span>
   );
}