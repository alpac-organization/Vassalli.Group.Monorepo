import { InputText, RadioButton } from "@alpac/design-system";
import {
	gateEntryInputClassName,
	gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { VehicleDataStepProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data-step/types/vehicle-data.props";
import { validateOnlyLettersWithAccentsAndDiacritics } from "@app/shared/utils/string.utils";
import { useState } from "react";

export function VehicleDataStep({ register, errors }: VehicleDataStepProps) {
	const [selectedModality, setSelectedModality] = useState<"reception" | "dispatch">("reception");
	const [selectedWarehouseType, setSelectedWarehouseType] = useState<"fiscal" | "nationalized">("fiscal");

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2">
			<div className="flex flex-col">
				<span>Modalidad de acceso</span>
				<div className="flex flex-row gap-4 items-center h-12">
					<RadioButton
						label="Para Recepción"
						value="reception"
						checked={selectedModality === "reception"}
						onChange={() => setSelectedModality("reception")}
					/>

					<RadioButton
						label="Para Despacho"
						value="dispatch"
						checked={selectedModality === "dispatch"}
						onChange={() => setSelectedModality("dispatch")}
					/>
				</div>
			</div>

			{selectedModality === "reception" && (
				<div className="flex flex-col">
					<span>Tipo de bodega</span>
					<div className="flex flex-row gap-4 items-center h-12">
						<RadioButton
							label="Fiscal"
							value="fiscal"
							checked={selectedWarehouseType === "fiscal"}
							onChange={() => setSelectedWarehouseType("fiscal")}
						/>

						<RadioButton
							label="Nacionalizada"
							value="nationalized"
							checked={selectedWarehouseType === "nationalized"}
							onChange={() => setSelectedWarehouseType("nationalized")}
						/>
					</div>
				</div>
			)}

			<InputText
				label="País de Origen"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("countryOfOrigin", {
					required: "El país de procedencia es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
					validate: {
						onlyLetters: (value: string) =>
							validateOnlyLettersWithAccentsAndDiacritics(value || "", true),
					},
				})}
				error={errors.countryOfOrigin && errors.countryOfOrigin.message}
			/>

			<InputText
				label="Aduana de Ingreso"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("aduana", {
					required: "La Aduana de ingreso es obligatoria.",
					setValueAs: (value: string) => value?.trim(),
					validate: {
						onlyLetters: (value: string) =>
							validateOnlyLettersWithAccentsAndDiacritics(value || "", true),
					},
				})}
				error={errors.aduana && errors.aduana.message}
			/>

			<InputText
				label="Placa del Cabezal"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("plateNumber", {
					required: "El número de placa es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.plateNumber && errors.plateNumber.message}
			/>

			<InputText
				label="Trailer / Chasis"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("trailerChassis", {
					required: "El número de chasis/remolque es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.trailerChassis && errors.trailerChassis.message}
			/>

			<InputText
				label="Conductor"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("driverName", {
					required: "El nombre del conductor es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
					validate: {
						onlyLetters: (value: string) =>
							validateOnlyLettersWithAccentsAndDiacritics(value || "", true),
					},
				})}
				error={errors.driverName && errors.driverName.message}
			/>

			<InputText
				label="Licencia"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("driverLicense", {
					required: "La licencia del conductor es obligatoria.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.driverLicense && errors.driverLicense.message}
			/>

			<InputText
				label="Transportista"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("transportista", {
					required: "La empresa transportista es requerida.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.transportista && errors.transportista.message}
			/>

			<InputText
				label="Consignatario"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("consignee", {
					required: "El consignatario es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.consignee && errors.consignee.message}
			/>

			<InputText
				label="Marchamo"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				isRequired
				{...register("sealNumber", {
					required: "El número de marchamo es obligatorio.",
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.sealNumber && errors.sealNumber.message}
			/>

			<InputText
				label="Medio"
				labelClassName={gateEntryLabelClassName}
				className={gateEntryInputClassName}
				{...register("medio", {
					required: false,
					setValueAs: (value: string) => value?.trim(),
				})}
				error={errors.medio && errors.medio.message}
			/>
		</div>
	);
}
