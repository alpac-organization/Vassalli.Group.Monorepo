import { useState } from "react";
import { Bell } from "lucide-react";
import type { NotificationBannerProps } from "./notification-banner.types";
import { Button } from "@alpac/design-system";
import { NotificationConfirm } from "../notification-confirm/notification-confirm";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationPermissionBanner({ permissionGranted, requestPermission, isLoading }: NotificationBannerProps) {
	const [dismissed] = useState(false);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [willChange, setWillChange] = useState("transform, opacity");

	const isDenied = typeof Notification !== "undefined" && Notification.permission === "denied";

	return (
		<>
			<AnimatePresence>
				{permissionGranted === false && !dismissed && (
					<motion.div
						key="notification-permission-banner"
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						style={{ willChange }}
						onAnimationStart={() => setWillChange("transform, opacity")}
						onAnimationComplete={() => setWillChange("auto")}
						className="relative w-full overflow-hidden bg-linear-to-r from-[#3a2b6e] via-[#5b2d8f] to-[#7b2fa3] px-4 py-3 text-white shadow-md">
						<div className="container max-w-330 m-auto">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
									<Bell size={18} />
								</div>

								{/* Mobile: copy corto + dos botones */}
								<div className="flex flex-1 min-w-0 items-center justify-between gap-2 md:hidden">
									<p className="text-xs text-white/85 truncate">
										Notificaciones desactivadas
									</p>

									<div className="flex shrink-0 gap-2">
										<button
											className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-[#5b2d8f] transition hover:bg-white/90"
											onClick={() => setIsConfirmOpen(true)}
										>
											Activar
										</button>
									</div>
								</div>

								<div className="hidden flex-1 min-w-0 items-center justify-between gap-4 md:flex">

									<p className="text-sm text-white/85 truncate">
										Actualmente no tienes permisos para recibir notificaciones. Activalas para no perderte actualizaciones importantes.
									</p>

									<Button
										label={isDenied ? "Cómo activar" : "Activar notificaciones"}
										size="medium"
										className="shrink-0! rounded-lg! bg-white! px-4! py-1.5! text-[16px]! font-medium! text-[#5b2d8f]! transition! hover:bg-white/90!"
										onClick={() => setIsConfirmOpen(true)}
									/>

								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<NotificationConfirm
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={async () => {
					await requestPermission();
				}}
				isLoading={isLoading}
			/>
		</>
	);
}