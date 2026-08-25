import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { EllipsisVerticalIcon } from "lucide-react";
import type { ContextMenuProps, MenuPosition } from "./context-menu.type";
import { Button } from "../../buttons";
import { createPortal } from "react-dom";

const loadFeatures = () =>
	import("framer-motion").then((res) => res.domAnimation);

const MENU_GAP = 6;
const VIEWPORT_PADDING = 8;
const FALLBACK_MENU_WIDTH = 160;
const FALLBACK_ITEM_HEIGHT = 40;

export const ContextMenu = ({
	items,
	triggerLabel,
	triggerClassName,
	triggerIcon,
	triggerButtonSize,
	openUpOnMobile = false,
	disabled = false,
}: ContextMenuProps) => {
	const [open, setOpen] = useState(false);
	const [position, setPosition] = useState<MenuPosition | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);

	const updatePosition = () => {
		const trigger = containerRef.current;
		if (!trigger) return;

		const rect = trigger.getBoundingClientRect();
		const menuWidth = menuRef.current?.offsetWidth || FALLBACK_MENU_WIDTH;
		const menuHeight =
			menuRef.current?.offsetHeight ||
			Math.max(items.length, 1) * FALLBACK_ITEM_HEIGHT;

		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		const forceOpenUp =
			openUpOnMobile && window.matchMedia("(max-width: 639px)").matches;
		const openUp =
			forceOpenUp ||
			(spaceBelow < menuHeight + MENU_GAP && spaceAbove > spaceBelow);

		let top = openUp
			? rect.top - menuHeight - MENU_GAP
			: rect.bottom + MENU_GAP;

		let left = rect.right - menuWidth;

		if (left < VIEWPORT_PADDING) {
			left = rect.left;
		}

		if (left + menuWidth > window.innerWidth - VIEWPORT_PADDING) {
			left = window.innerWidth - menuWidth - VIEWPORT_PADDING;
		}

		if (top < VIEWPORT_PADDING) {
			top = VIEWPORT_PADDING;
		}

		if (top + menuHeight > window.innerHeight - VIEWPORT_PADDING) {
			top = Math.max(
				VIEWPORT_PADDING,
				window.innerHeight - menuHeight - VIEWPORT_PADDING,
			);
		}

		setPosition((prev) => {
			if (
				prev &&
				prev.top === top &&
				prev.left === left &&
				prev.openUp === openUp
			) {
				return prev;
			}

			return { top, left, openUp };
		});
	};

	const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
		let parent = el?.parentElement ?? null;

		while (parent) {
			const style = getComputedStyle(parent);
			const overflow = style.overflow + style.overflowX + style.overflowY;
			if (/(auto|scroll)/.test(overflow)) return parent;
			parent = parent.parentElement;
		}

		return null;
	};

	const isScrollbarClick = (event: MouseEvent, el: HTMLElement) => {
		const rect = el.getBoundingClientRect();
		const onVertical = event.clientX >= rect.left + el.clientWidth;
		const onHorizontal = event.clientY >= rect.top + el.clientHeight;
		return onVertical || onHorizontal;
	};

	useLayoutEffect(() => {
		if (!open) {
			setPosition(null);
			return;
		}

		updatePosition();
	}, [open, items.length]);

	useLayoutEffect(() => {
		if (!open || !position || !menuRef.current) return;
		updatePosition();
	}, [open, position?.top, position?.left, position?.openUp]);

	useEffect(() => {
		if (!open) return;

		const scrollParent = getScrollParent(containerRef.current);

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			if (containerRef.current?.contains(target)) return;
			if (menuRef.current?.contains(target)) return;
			if (scrollParent && isScrollbarClick(event, scrollParent)) return;

			setOpen(false);
		};

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};

		const handleReposition = () => {
			updatePosition();
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		window.addEventListener("resize", handleReposition);
		window.addEventListener("scroll", handleReposition, true);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("resize", handleReposition);
			window.removeEventListener("scroll", handleReposition, true);
		};
	}, [open]);

	const menu =
		open && position
			? createPortal(
				<LazyMotion features={loadFeatures} strict>
					<AnimatePresence>
						<m.ul
							ref={menuRef}
							role="menu"
							initial={{
								opacity: 0,
								y: position.openUp ? 6 : -6,
								scale: 0.98,
							}}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{
								opacity: 0,
								y: position.openUp ? 4 : -4,
								scale: 0.98,
							}}
							transition={{ duration: 0.16, ease: "easeOut" }}
							style={{
								position: "fixed",
								top: position.top,
								left: position.left,
							}}
							className={[
								"m-0! z-50 min-w-40 overflow-hidden rounded-lg border border-slate-200",
								"bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
								"dark:bg-[#272b34] dark:border-slate-600 dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
								position.openUp ? "origin-bottom-right" : "origin-top-right",
							].join(" ")}
						>
							{items.map((item, index) => {
								if (item.separator) {
									return (
										<li
											key={`separator-${index}`}
											role="separator"
											className="my-1 border-t border-slate-200 dark:border-slate-600"
										/>
									);
								}

								const showDivider =
									index < items.length - 1 && !items[index + 1]?.separator;

								return (
									<li
										key={item.label}
										role="none"
										className={
											showDivider
												? "border-b border-slate-200 dark:border-slate-600"
												: undefined
										}
									>
										<button
											type="button"
											role="menuitem"
											disabled={item.disabled}
											onClick={() => {
												item.onClick();
												setOpen(false);
											}}
											className="w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors
                                 hover:bg-slate-100 whitespace-nowrap
                                 disabled:cursor-not-allowed disabled:opacity-50
                                 dark:text-slate-200 dark:hover:bg-slate-700/60"
										>
											{item.label}
										</button>
									</li>
								);
							})}
						</m.ul>
					</AnimatePresence>
				</LazyMotion>,
				document.body,
			)
			: null;

	return (
		<div ref={containerRef} className="relative inline-block">
			<Button
				type="button"
				aria-expanded={open}
				aria-haspopup="menu"
				size={triggerButtonSize ?? "giant"}
				disabled={disabled}
				onClick={() => {
					if (items.length === 0) {
						setOpen(false);
						return;
					}

					setOpen((prev) => !prev);
				}}
				className={[triggerClassName].filter(Boolean).join(" ")}
				label={triggerLabel ?? ""}
				icon={triggerIcon ?? <EllipsisVerticalIcon size={20} />}
			/>

			{menu}
		</div>
	);
};
