// notification-permission-banner.tsx
import { useState } from "react";
import { Bell } from "lucide-react";
import type { NotificationBannerProps } from "./notification-banner.types";

export function NotificationPermissionBanner({ permissionGranted }: NotificationBannerProps) {
    const [dismissed] = useState(false);

	if (permissionGranted !== false || dismissed) return null;

	const isDenied = typeof Notification !== "undefined" && Notification.permission === "denied";

	return (
		<>
            <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#3a2b6e] via-[#5b2d8f] to-[#7b2fa3] px-4 py-3 text-white shadow-md">
                <div className="container max-w-330 m-auto">                
                    <div className="flex items-center gap-3 pr-5">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                            <Bell size={18} />
                        </div>

                        {/* Mobile: copy corto + dos botones */}
                        <div className="flex flex-1 min-w-0 items-center justify-between gap-2 md:hidden">
                            <p className="text-xs text-white/85 truncate">
                                Notificaciones desactivadas
                            </p>

                            <div className="flex flex-shrink-0 gap-2">
                                <button
                                    className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-[#5b2d8f] transition hover:bg-white/90"
                                >
                                    Activar
                                </button>
                            </div>
                        </div>

                        <div className="hidden flex-1 min-w-0 items-center justify-between gap-4 md:flex">
                            <p className="text-sm text-white/85 truncate">
                                Actualmente no tenés permisos para recibir notificaciones. Activalas para no perderte actualizaciones importantes.
                            </p>
                            <button
                                className="flex-shrink-0 rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-[#5b2d8f] transition hover:bg-white/90"
                            >
                                {isDenied ? "Cómo activar" : "Activar notificaciones"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
		</>
	);
}