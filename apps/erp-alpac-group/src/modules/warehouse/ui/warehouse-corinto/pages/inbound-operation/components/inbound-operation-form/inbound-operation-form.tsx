import { Button, InputText, Modal } from "@alpac/design-system";

import type { InboundOperationFormProps } from "./inbound-operation-form.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";

export const InboundOperationForm = (props: InboundOperationFormProps): React.ReactNode => {	
	
	const handleClose = () => {
		props.onClose();
	};

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={handleClose}
			title="Crear Registro de Cliente"
			variant="form"
			size="3xl"
			description="Complete la información del cliente"
		>
			<form
				className="flex flex-col gap-5"
				onSubmit={(event) => {
					event.preventDefault();
					props.onSubmit({ });
				}}>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<InputText
						label="Nombre del cliente"
						placeholder="Ej. Agroindustrial del Pacífico"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="RUC / Identificación"
						placeholder="Ej. J0310000000000"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
					/>					

					<InputText
						label="Teléfono"
						placeholder="Ej. 8888-8888"
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Correo electrónico"
						placeholder="Ej. contacto@cliente.com"
						className={inputClassName}
						labelClassName={labelClassName}
					/>

					<InputText
						label="Dirección"
						placeholder="Ej. Carretera a Corinto, Km 12"
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
						label="Guardar"
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
		</Modal>
	);
};
