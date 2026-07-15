import { useState } from "react";
import { Button, Dropdown, InputText, Modal } from "@alpac/design-system";
import type { WarehouseModalProps } from "./warehouse-modal.types";
import { WarehouseTypeOptions } from "@app/modules/warehouse/domain/enums/warehouse.enum";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

const warehouseStatusOptions = [
	{ label: "Disponible", value: "available" },
	{ label: "Casi llena", value: "almost_full" },
	{ label: "Mantenimiento", value: "maintenance" },
];

export const WarehouseModal = ({ isOpen, onClose, onSubmit }: WarehouseModalProps) => {
	const [warehouseType, setWarehouseType] = useState<string>("");
	const [warehouseStatus, setWarehouseStatus] = useState<string>("");

	const handleClose = () => {
		setWarehouseType("");
		setWarehouseStatus("");
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de nueva bodega"
			variant="form"
			size="3xl"
			description="Complete el registro de bodega"
		>
			<form
				className="flex flex-col gap-5"
				onSubmit={(event) => {
					event.preventDefault();
					onSubmit({
						type: warehouseType,
						status: warehouseStatus,
					});
				}}
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<InputText
						label="Nombre de la bodega"
						placeholder="Ej. Bodega Corinto 1"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Código"
						placeholder="Ej. COR-01"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<Dropdown
						label="Tipo de bodega"
						placeholder="Seleccione..."
						isRequired
						options={WarehouseTypeOptions}
						value={warehouseType}
						onChange={(value) => setWarehouseType(String(value))}
						appearance="dark"
						className={inputClassName}
						labelClassName={labelClassName}
						valueClassName="text-black! dark:text-white!"
					/>

					<Dropdown
						label="Estado"
						placeholder="Seleccione..."
						isRequired
						options={warehouseStatusOptions}
						value={warehouseStatus}
						onChange={(value) => setWarehouseStatus(String(value))}
						appearance="dark"
						className={inputClassName}
						labelClassName={labelClassName}
						valueClassName="text-black! dark:text-white!"
					/>

					<InputText
						label="Capacidad (kg)"
						placeholder="Ej. 150000"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Ubicación"
						placeholder="Ej. Puerto de Corinto, Zona Norte"
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<div className="md:col-span-2">
						<InputText
							label="Descripción"
							placeholder="Ej. Bodega destinada a almacenamiento de azúcar en granel"
							className={inputClassName}
							labelClassName={labelClassName}
						/>
					</div>
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
						label="Guardar"
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
