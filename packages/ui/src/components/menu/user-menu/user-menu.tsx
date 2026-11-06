import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";
import type { UserMenuItem, UserMenuProps } from "./user-menu.types";

const ANIMATION_MS = 200;
const DRAG_CLOSE_THRESHOLD = 80;

const getInitials = (name?: string) =>
   (name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";

const useMediaQuery = (query: string) => {
   const [matches, setMatches] = useState(
      () => typeof window !== "undefined" && window.matchMedia(query).matches,
   );

   useEffect(() => {
      const mql = window.matchMedia(query);
      const update = () => setMatches(mql.matches);
      update();
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
   }, [query]);

   return matches;
};

interface UserAvatarProps {
   name?: string;
   pictureUrl?: string | null;
   className?: string; // tamaño, texto y ring
}

const UserAvatar = ({ name, pictureUrl, className = "" }: UserAvatarProps) => {
   const [failed, setFailed] = useState(false);

   // Si cambia la URL, se vuelve a intentar cargar la imagen
   useEffect(() => {
      setFailed(false);
   }, [pictureUrl]);

   const showImage = Boolean(pictureUrl) && !failed;

   return (
      <span
         className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-alpac-primary-500 font-bold text-white ${className}`}
      >
         {showImage ? (
            <img
               src={pictureUrl!}
               alt={name ? `Foto de ${name}` : "Foto de perfil"}
               className="h-full w-full object-cover"
               referrerPolicy="no-referrer"
               onError={() => setFailed(true)}
            />
         ) : (
            getInitials(name)
         )}
      </span>
   );
};

export const UserMenu = function ({ userName, email, costCenterName, pictureUrl, items }: UserMenuProps) {
   const [open, setOpen] = useState(false);       // intención del usuario
   const [mounted, setMounted] = useState(false); // el panel existe en el DOM
   const [shown, setShown] = useState(false);     // estado visual (animación)
   const [position, setPosition] = useState({ top: 0, right: 16 });
   const [dragY, setDragY] = useState(0);
   const [dragging, setDragging] = useState(false);

   const containerRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const panelRef = useRef<HTMLDivElement>(null);
   const dragStartY = useRef<number | null>(null);

   const isDesktop = useMediaQuery("(min-width: 768px)");
   const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
   const duration = reduceMotion ? 0 : ANIMATION_MS;

   const visibleItems = items.filter((item) => !item.hidden);

   // Montaje y animación de entrada / salida
   useEffect(() => {
      if (open) {
         setMounted(true);
         let inner = 0;
         const outer = requestAnimationFrame(() => {
            inner = requestAnimationFrame(() => setShown(true));
         });
         return () => {
            cancelAnimationFrame(outer);
            cancelAnimationFrame(inner);
         };
      }

      setShown(false);
      const timer = window.setTimeout(() => setMounted(false), duration);
      return () => window.clearTimeout(timer);
   }, [open, duration]);

   // Posición del panel en escritorio (el panel vive en un portal, fuera del header)
   useLayoutEffect(() => {
      if (!open || !isDesktop) return;

      const update = () => {
         const rect = triggerRef.current?.getBoundingClientRect();
         if (!rect) return;
         setPosition({
            top: rect.bottom + 12,
            right: Math.max(16, window.innerWidth - rect.right),
         });
      };

      update();
      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, true);
      return () => {
         window.removeEventListener("resize", update);
         window.removeEventListener("scroll", update, true);
      };
   }, [open, isDesktop]);

   // Click/toque fuera y Escape
   useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
         const target = event.target as Node;
         if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
         setOpen(false);
      };
      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setOpen(false);
            triggerRef.current?.focus();
         }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown, { passive: true });
      document.addEventListener("keydown", handleEscape);
      return () => {
         document.removeEventListener("mousedown", handlePointerDown);
         document.removeEventListener("touchstart", handlePointerDown);
         document.removeEventListener("keydown", handleEscape);
      };
   }, [open]);

   // En móvil bloquea el scroll del fondo
   useEffect(() => {
      if (!open || isDesktop) return;

      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = previous;
      };
   }, [open, isDesktop]);

   // Reinicia el arrastre si se pasa a escritorio (rotación / resize)
   useEffect(() => {
      setDragY(0);
      setDragging(false);
      dragStartY.current = null;
   }, [isDesktop]);

   const handleItemClick = (item: UserMenuItem) => {
      if (item.disabled) return;
      setOpen(false);
      item.onClick?.();
   };

   // Arrastrar el asa hacia abajo para cerrar (móvil)
   const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
      dragStartY.current = event.clientY;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
   };
   const handleDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragStartY.current === null) return;
      setDragY(Math.max(0, event.clientY - dragStartY.current));
   };
   const handleDragEnd = () => {
      if (dragStartY.current === null) return;
      const shouldClose = dragY > DRAG_CLOSE_THRESHOLD;
      dragStartY.current = null;
      setDragging(false);
      setDragY(0);
      if (shouldClose) setOpen(false);
   };

   const panelContent = (
      <>
         {/* Identidad */}
         <div className="flex items-center gap-4 px-5 pb-4 pt-2 md:pt-5">
            
            <UserAvatar
               name={userName}
               pictureUrl={pictureUrl}
               className="h-14 w-14 text-lg ring-4 ring-alpac-primary-500/20"
            />

            <div className="min-w-0 leading-tight">
               <p className="truncate text-base font-semibold text-white">{userName}</p>
               {email && <p className="mt-0.5 truncate text-sm text-[#9BA3B2]">{email}</p>}
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
                           className={`group flex min-h-14 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none active:bg-white/10 md:min-h-12 ${
                              item.disabled
                                 ? "cursor-not-allowed text-[#9BA3B2]"
                                 : isDanger
                                    ? "text-red-300 hover:bg-red-500/10 focus-visible:bg-red-500/10 active:bg-red-500/15"
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

                           <span className="min-w-0 flex-1 truncate">{item.label}</span>

                           {item.badge && (
                              <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-normal text-[#9BA3B2]">
                                 {item.badge}
                              </span>
                           )}

                           {!item.badge && !item.disabled && !isDanger && (
                              <ChevronRight
                                 size={16}
                                 aria-hidden
                                 className="shrink-0 text-[#6B7280] transition-transform group-hover:translate-x-0.5"
                              /> 
                           )}
                        </button>
                     </Fragment>
                  );
               })}
            </div>
         )}
      </>
   );

   return (
      <>
         <div ref={containerRef} className="relative">
            {/* Botón: móvil = solo avatar (igual que la campana), escritorio = píldora */}
            <button
               ref={triggerRef}
               type="button"
               onClick={() => setOpen((value) => !value)}
               aria-haspopup="menu"
               aria-expanded={open}
               aria-label="Menú de usuario"
               className="flex h-11 items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#286fe0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#272b34] md:pr-4"
            >
               <UserAvatar name={userName} pictureUrl={pictureUrl} className="h-9 w-9 text-xs" />

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
         </div>

         {/* Portal: evita que el backdrop-filter / z-index del header atrapen el panel */}
         {mounted &&
            createPortal(
               isDesktop ? (
                  <div
                     ref={panelRef}
                     role="menu"
                     aria-label="Opciones de usuario"
                     style={{
                        top: position.top,
                        right: position.right,
                        transitionDuration: `${duration}ms`,
                     }}
                     className={`fixed z-60 w-80 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#1f232b] pb-2 shadow-2xl transition-[opacity,transform] ease-out ${
                        shown ? "scale-100 opacity-100" : "scale-95 opacity-0"
                     }`}
                  >
                     {panelContent}
                  </div>
               ) : (
                  <>
                     <div
                        className="fixed inset-0 z-50 bg-[#292e36] backdrop-blur-[2px] transition-opacity"
                        style={{
                           opacity: shown ? Math.max(0.3, 1 - dragY / 400) : 0,
                           transitionDuration: dragging ? "0ms" : `${duration}ms`,
                        }}
                        onClick={() => setOpen(false)}
                        aria-hidden
                     />

                     <div
                        ref={panelRef}
                        role="menu"
                        aria-label="Opciones de usuario"
                        style={{
                           transform: shown ? `translateY(${dragY}px)` : "translateY(100%)",
                           transition: dragging ? "none" : `transform ${duration}ms ease-out`,
                        }}
                        className="fixed inset-x-0 bottom-0 z-60 max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-3xl border-t border-white/10 bg-[#1f232b] pb-[max(env(safe-area-inset-bottom),0.75rem)] shadow-2xl"
                     >
                        {/* Asa: zona táctil grande para arrastrar y cerrar */}
                        <div
                           className="flex cursor-grab touch-none justify-center pb-3 pt-3 active:cursor-grabbing"
                           onPointerDown={handleDragStart}
                           onPointerMove={handleDragMove}
                           onPointerUp={handleDragEnd}
                           onPointerCancel={handleDragEnd}
                           aria-hidden
                        >
                           <span className="h-1.5 w-11 rounded-full bg-white/20" />
                        </div>

                        {panelContent}
                     </div>
                  </>
               ),
               document.body,
            )}
      </>
   );
};