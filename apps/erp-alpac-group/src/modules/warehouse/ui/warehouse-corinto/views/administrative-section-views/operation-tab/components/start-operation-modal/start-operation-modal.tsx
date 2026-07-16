import { useState } from "react";
import { Button, Dropdown, InputText, Modal } from "@alpac/design-system";

import type { StartOperationFormProps } from "./start-operation-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const operationTypeOptions = [
	{ label: "Recepción", value: "inbound" },
	{ label: "Despacho", value: "outbound" },
];

const presentationOptions = [
	{ label: "Granel", value: "bulk" },
	{ label: "Sacos", value: "bags" },
	{ label: "Contenedor", value: "container" },
];

const customerOptions = [
	{ label: "CASUR", value: "casur" },
	{ label: "Agroindustrial del Pacífico", value: "agroindustrial" },
	{ label: "Nicaragua Sugar Estates", value: "nse" },
];

export const StartOperationModal = (props: StartOperationFormProps): React.ReactNode => {
	const [operationType, setOperationType] = useState<string>("");
	const [customerId, setCustomerId] = useState<string>("");
	const [presentation, setPresentation] = useState<string>("");

	const handleClose = () => {
		setOperationType("");
		setCustomerId("");
		setPresentation("");
		props.onClose();
	};

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={handleClose}
			title="Registrar nueva operación"
			variant="form"
			size="6xl"
			description="Complete la información para iniciar la operación"
		>
			<form
				className="flex flex-col gap-5"
				onSubmit={(event) => {
					event.preventDefault();
					props.onSubmit({
						operationType,
						customerId,
						presentation,
					});
				}}
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Dropdown
						label="Tipo de operación"
						placeholder="Seleccione..."
						isRequired
						options={operationTypeOptions}
						value={operationType}
						onChange={(value) => setOperationType(String(value))}
						appearance="dark"
						className={inputClassName}
						labelClassName={labelClassName}
						valueClassName="text-black! dark:text-white!"
					/>

					<Dropdown
						label="Cliente"
						placeholder="Seleccione un cliente..."
						isRequired
						options={customerOptions}
						value={customerId}
						onChange={(value) => setCustomerId(String(value))}
						appearance="dark"
						className={inputClassName}
						labelClassName={labelClassName}
						valueClassName="text-black! dark:text-white!"
					/>

					<InputText
						label="Exportador"
						placeholder="Ej. CASUR Export"
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Producto"
						placeholder="Ej. Azúcar en granel"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<Dropdown
						label="Presentación"
						placeholder="Seleccione..."
						isRequired
						options={presentationOptions}
						value={presentation}
						onChange={(value) => setPresentation(String(value))}
						appearance="dark"
						className={inputClassName}
						labelClassName={labelClassName}
						valueClassName="text-black! dark:text-white!"
					/>

					<InputText
						label="Lote / Zafra"
						placeholder="Ej. Zafra 2025-2026 / Lote A-14"
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Nombre del conductor"
						placeholder="Ej. Carlos Fernando Meza"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Identificación del conductor"
						placeholder="Ej. 001-220145-0078D"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Placa del vehículo"
						placeholder="Ej. LE 233-554"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Placa del remolque"
						placeholder="Ej. R-554-XZ"
						className={inputClassName}
						labelClassName={labelClassName}
					/>
				</div>

				<div className="border-t border-t-slate-300 dark:border-t-neutral-600 -mx-6" />

				<div className="flex min-w-0 flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={handleClose}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-white! dark:bg-transparent! text-slate-700! dark:text-slate-300! border! border-slate-300! dark:border-slate-600! hover:bg-slate-50! dark:hover:bg-slate-700/30! sm:w-auto!"
					/>
					<Button
						type="submit"
						size="giant"
						label="Iniciar operación"
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
