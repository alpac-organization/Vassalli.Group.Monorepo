import { InputText, Modal, Tabs } from "@alpac/design-system";
import type { TabModalProps } from "./tab-modal.types";
import { useCallback } from "react";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const TabModal = (props: TabModalProps) => {
	const handleClose = useCallback(() => {
		props.onClose();
	}, []);

	function element() {
		return (
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<InputText
					label="Campo 1"
					placeholder="Campo 1"
					isRequired
					className={inputClassName}
					labelClassName={labelClassName}
				/>
				<InputText
					label="Campo 2"
					placeholder="Campo 2"
					isRequired
					className={inputClassName}
					labelClassName={labelClassName}
				/>
				<InputText
					label="Campo 3"
					placeholder="Campo 3"
					className={inputClassName}
					labelClassName={labelClassName}
				/>
				<InputText
					label="Campo 4"
					placeholder="Campo 4"
					className={inputClassName}
					labelClassName={labelClassName}
				/>
			</div>
		);
	}

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={handleClose}
			title="Título de la modal"
			variant="default"
			size="3xl"
			description="Sub título de la modal"
		>
			<Tabs
				tabHeaders={[
					{ id: "tab1", label: "Tab 1", render: () => element() },
					{ id: "tab2", label: "Tab 2", render: (id) => `Sección ${id}` },
					{ id: "tab3", label: "Tab 3", render: (id) => `Sección ${id}` },
				]}
				activeTab="tab1"
			/>
		</Modal>
	);
};
