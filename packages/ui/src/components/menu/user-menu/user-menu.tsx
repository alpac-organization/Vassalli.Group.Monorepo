import { Fragment, useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";
import { UserMenuItem, UserMenuProps } from "./user-menu.types";

const getInitials = (name?: string) =>
   (name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

export const UserMenu = function ({ userName, email, costCenterName, items }: UserMenuProps) {
   const [open, setOpen] = useState(false);
   const [shown, setShown] = useState(false); // controla la animación de entrada
   const containerRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);

   const initials = getInitials(userName);
   const visibleItems = items.filter((item) => !item.hidden);

   // Click fuera, Escape y animación de entrada
   useEffect(() => {
      if (!open) {
         setShown(false);
         return;
      }

      const frame = requestAnimationFrame(() => setShown(true));

      const handleClickOutside = (event: MouseEvent) => {
         if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
         }
      };
      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setOpen(false);
            triggerRef.current?.focus();
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
         cancelAnimationFrame(frame);
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("keydown", handleEscape);
      };
   }, [open]);

   // En móvil bloquea el scroll del fondo mientras el panel está abierto
   useEffect(() => {
      if (!open) return;
      if (!window.matchMedia("(max-width: 767px)").matches) return;

      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = previous;
      };
   }, [open]);

   const handleItemClick = (item: UserMenuItem) => {
      if (item.disabled) return;
      setOpen(false);
      item.onClick?.();
   };

   return (
      <div ref={containerRef} className="relative">
         {/* Botón: en móvil solo avatar (mismo tamaño que la campana), en escritorio píldora completa */}
         <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Menú de usuario"
            className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286fe0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#272b34] md:pr-4"
         >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-xs font-bold text-white">
               {initials}
            </span>

            <span className="hidden min-w-0 flex-col items-start text-left leading-tight md:flex">
               <span className="max-w-40 truncate text-sm font-semibold text-white">{userName}</span>
               {costCenterName && (
                  <span className="max-w-40 truncate text-xs text-[#9BA3B2]">{costCenterName}</span>
               )}
            </span>

            <ChevronDown
               size={16}
               aria-hidden
               className={`hidden shrink-0 text-[#9BA3B2] transition-transform duration-200 md:block ${open ? "rotate-180" : ""}`}
            />
         </button>

         {open && (
            <>
               {/* Fondo: solo móvil */}
               <div
                  className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] transition-opacity duration-200 motion-reduce:transition-none md:hidden ${shown ? "opacity-100" : "opacity-0"}`}
                  onClick={() => setOpen(false)}
                  aria-hidden
               />

               {/* Móvil: hoja inferior a todo el ancho. Escritorio: panel bajo el botón */}
               <div
                  role="menu"
                  aria-label="Opciones de usuario"
                  className={`fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#1f232b] pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none ${shown ? "translate-y-0" : "translate-y-full"} md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-3 md:max-h-none md:w-80 md:translate-y-0 md:overflow-hidden md:rounded-2xl md:border md:pb-2`}
               >
                  {/* Asa (móvil) */}
                  <div className="flex justify-center pt-3 md:hidden" aria-hidden>
                     <span className="h-1.5 w-11 rounded-full bg-white/20" />
                  </div>

                  {/* Identidad */}
                  <div className="flex items-center gap-4 px-5 pb-4 pt-4 md:pt-5">
                     <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-alpac-primary-500 text-lg font-bold text-white ring-4 ring-alpac-primary-500/20">
                        {initials}
                     </span>
                     <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">{userName}</p>
                        {email && <p className="truncate text-sm text-[#9BA3B2]">{email}</p>}
                     </div>
                  </div>

                  {/* Centro de costo */}
                  {costCenterName && (
                     <div className="px-5 pb-4">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-3.5 py-2.5">
                           <Building2 size={18} className="shrink-0 text-[#7FA8FF]" aria-hidden />
                           <div className="min-w-0 leading-tight">
                              <p className="text-xs text-[#9BA3B2]">Centro de costo</p>
                              <p className="mt-0.5 truncate text-sm font-semibold text-white">{costCenterName}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Opciones recibidas por props */}
                  {visibleItems.length > 0 && (
                     <div className="border-t border-white/10 p-2">
                        {visibleItems.map((item, index) => {
                           const Icon = item.icon;
                           const isDanger = item.variant === "danger";
                           const previous = visibleItems[index - 1];
                           const startsDangerZone = isDanger && index > 0 && previous?.variant !== "danger";

                           return (
                              <Fragment key={item.id}>
                                 {startsDangerZone && <div className="mx-3 my-1.5 border-t border-white/10" />}

                                 <button
                                    type="button"
                                    role="menuitem"
                                    disabled={item.disabled}
                                    aria-disabled={item.disabled}
                                    onClick={() => handleItemClick(item)}
                                    className={`group flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none md:min-h-12 ${
                                       item.disabled
                                          ? "cursor-not-allowed text-[#9BA3B2]"
                                          : isDanger
                                             ? "text-red-300 hover:bg-red-500/10 focus-visible:bg-red-500/10"
                                             : "text-[#E8EAEF] hover:bg-white/5 focus-visible:bg-white/5"
                                    }`}
                                 >
                                    {Icon && (
                                       <span
                                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                             isDanger && !item.disabled
                                                ? "bg-red-500/10 text-red-300"
                                                : "bg-white/5 text-[#C9CED8]"
                                          } ${item.disabled ? "opacity-70" : ""}`}
                                       >
                                          <Icon size={18} aria-hidden />
                                       </span>
                                    )}

                                    <span className="flex-1">{item.label}</span>

                                    {item.badge && (
                                       <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-normal text-[#9BA3B2]">
                                          {item.badge}
                                       </span>
                                    )}

                                    {!item.badge && !item.disabled && !isDanger && (
                                       <ChevronRight size={16} aria-hidden className="text-[#6B7280] transition-transform group-hover:translate-x-0.5" />
                                    )}
                                 </button>
                              </Fragment>
                           );
                        })}
                     </div>
                  )}
               </div>
            </>
         )}
      </div>
   );
};