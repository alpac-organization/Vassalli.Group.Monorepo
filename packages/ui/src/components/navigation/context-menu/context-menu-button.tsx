import { ContextMenuButtonProps } from "./context-menu.type";

export const ContextMenuButton = ({ label, disabled, onClick }: ContextMenuButtonProps) => {

   return (
      <button
         type="button"
         role="menuitem"
         disabled={disabled}
         onClick={() => {
            onClick?.();
         }}
         className="w-full px-3 py-2 text-left text-sm text-slate-700 transition-colorshover:bg-slate-100 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
      >
         {label}
      </button>
   );
}