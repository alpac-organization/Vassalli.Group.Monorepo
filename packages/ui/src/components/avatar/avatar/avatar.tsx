import { useRef, useState } from "react";
import { Tooltip } from "../../tooltips";
import { AvatarProps } from "./avatar.type";

export const Avatar = ({
   label, pictureUrl, hasLabel = true, tooltip, tooltipPlacement = "right"
}: AvatarProps) => {

   const refAvatarImage = useRef<HTMLImageElement>(null);
   const [isVisibleTooltip, setIsVisibleTooltip] = useState(false);

   function getInitials(fullname?: string): string {
      if (!fullname?.trim()) return "?";
      const parts = fullname.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
   }

   return (
      <>
         <div className="flex items-center gap-3 min-w-0">
            {pictureUrl ? (
               <img
                  ref={refAvatarImage ?? null}
                  src={pictureUrl}
                  alt={label}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-neutral-600 cursor-grab"
                  onMouseEnter={() => setIsVisibleTooltip(true)}
                  onMouseLeave={() => setIsVisibleTooltip(false)}
               />
            ) : (
               <span
                  ref={refAvatarImage ?? null}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-[#363a45] dark:text-white dark:ring-neutral-600"
                  onMouseEnter={() => setIsVisibleTooltip(true)}
                  onMouseLeave={() => setIsVisibleTooltip(false)}
               >
                  {getInitials(label)}
               </span>
            )}
            {hasLabel && (
               <span className="truncate text-slate-900 dark:text-white">
                  {label}
               </span>
            )}
         </div>

         {tooltip && isVisibleTooltip && (
            <Tooltip anchorRef={refAvatarImage} placement={tooltipPlacement}>
               {tooltip}
            </Tooltip>
         )}
      </>
   );
}