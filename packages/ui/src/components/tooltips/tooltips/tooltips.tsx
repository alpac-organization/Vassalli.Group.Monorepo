import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TooltipPlacement, TooltipPosition, TooltipProps } from "./tooltips.type";

const VIEWPORT_PADDING = 8;
const DESKTOP_BREAKPOINT = "(min-width: 640px)";
const DESKTOP_TOOLTIP_MAX_WIDTH = 280;
const SIDE_GAP = 8;

const TOOLTIP_SURFACE =
	"relative w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-snug text-slate-900 wrap-break-words whitespace-normal dark:border-slate-600 dark:bg-[#272b34] dark:text-white";
const TOOLTIP_TRANSFORM: Record<TooltipPlacement, string | undefined> = {
	top: "translateY(-100%)",
	bottom: undefined,
	left: "translateY(-50%)",
	right: "translateY(-50%)",
};
const ARROW_CLIP_PATH = "polygon(0 0, 100% 0, 100% 100%)";
const ARROW_CLASS: Record<TooltipPlacement, string> = {
	bottom: "top-[-1px] left-3 -translate-y-1/2 -rotate-45",
	top: "bottom-[-1px] left-3 translate-y-1/2 rotate-[135deg]",
	right: "left-[-1px] top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[135deg]",
	left: "right-[-1px] top-1/2 translate-x-1/2 -translate-y-1/2 rotate-45",
};

function TooltipArrow({ placement }: { placement: TooltipPlacement }) {
	return (
		<span
			aria-hidden={true}
			className={`absolute size-2 border border-inherit bg-inherit ${ARROW_CLASS[placement]}`}
			style={{ clipPath: ARROW_CLIP_PATH }}
		/>
	);
}

export function Tooltip({ children, anchorRef, placement }: TooltipProps) {

	const [position, setPosition] = useState<TooltipPosition | null>(null);

	useLayoutEffect(() => {

		const update = () => {

			const el = anchorRef.current;
			if (!el) return;

			const rect = el.getBoundingClientRect();
			const isDesktop = window.matchMedia(DESKTOP_BREAKPOINT).matches;
			const resolvedPlacement: TooltipPlacement =
				placement ?? (isDesktop ? "left" : "bottom");

			const maxWidth = isDesktop
				? Math.min(
					DESKTOP_TOOLTIP_MAX_WIDTH,
					window.innerWidth - VIEWPORT_PADDING * 2,
				)
				: Math.min(
					window.innerWidth - VIEWPORT_PADDING * 2,
					Math.max(rect.width, 220),
				);

			if (resolvedPlacement === "left") {
				let left = rect.left - maxWidth - SIDE_GAP;
				if (left < VIEWPORT_PADDING) {
					left = VIEWPORT_PADDING;
				}

				setPosition({
					top: rect.top + rect.height / 2,
					left,
					maxWidth,
					placement: "left",
				});
				return;
			}

			if (resolvedPlacement === "right") {
				let left = rect.right + SIDE_GAP;
				if (left + maxWidth > window.innerWidth - VIEWPORT_PADDING) {
					left = window.innerWidth - maxWidth - VIEWPORT_PADDING;
				}
				if (left < VIEWPORT_PADDING) {
					left = VIEWPORT_PADDING;
				}

				setPosition({
					top: rect.top + rect.height / 2,
					left,
					maxWidth,
					placement: "right",
				});
				return;
			}

			let left = rect.left;
			if (left + maxWidth > window.innerWidth - VIEWPORT_PADDING) {
				left = window.innerWidth - maxWidth - VIEWPORT_PADDING;
			}
			if (left < VIEWPORT_PADDING) {
				left = VIEWPORT_PADDING;
			}

			if (resolvedPlacement === "top") {
				setPosition({
					top: rect.top - 4,
					left,
					maxWidth,
					placement: "top",
				});
				return;
			}

			setPosition({
				top: rect.bottom + 4,
				left,
				maxWidth,
				placement: "bottom",
			});
		};

		update();
		window.addEventListener("scroll", update, true);
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update, true);
			window.removeEventListener("resize", update);
		};
	}, [anchorRef, placement]);

	if (!position || typeof document === "undefined") return null;

	return createPortal(
		<span
			role="tooltip"
			className="pointer-events-none fixed z-9999 drop-shadow-[0_4px_12px_rgba(15,23,42,0.12)] dark:drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
			style={{
				top: position.top,
				left: position.left,
				width: position.maxWidth,
				maxWidth: position.maxWidth,
				transform: TOOLTIP_TRANSFORM[position.placement],				
			}}
		>
			<div className={TOOLTIP_SURFACE}>
				<TooltipArrow placement={position.placement} />
				{children}
			</div>
		</span>,
		document.body,
	);
}
