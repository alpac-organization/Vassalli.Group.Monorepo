
import type { SectionShapeMenuProps } from "./section-shape-menu.types";

export const SectionShapeMenu = ({ menu, setMenu, onEdit }: SectionShapeMenuProps) => {

   const MenuButton = ({ label, onClick }: { label: string, onClick: () => void }) => {

      return (
         <button
            type="button"
            className="w-fit px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
            onClick={onClick}>
            {label}
         </button>
      )
   }

   return (
      <>
         {menu && (<div
            className="fixed z-50 m-0! min-w-15 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:bg-[#272b34] dark:border-slate-600 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
            style={{ left: menu.x, top: menu.y }}
         >
            <MenuButton
               label="Editar"
               onClick={() => {
                  onEdit(menu.section);
                  setMenu(null);
               }}
            />
         </div>)}
      </>
   );
}