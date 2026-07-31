import { Dropdown, InputText, RadioButton } from "@alpac/design-system";
import {
	gateEntryInputClassName,
	gateEntryLabelClassName,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/utils/gate-entry-modal.styles";
import type { VehicleDataStepProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/components/vehicle-data/types/vehicle-data.props";
import {
	DISPATCH_TRANSPORT_MEDIA,
	RECEPTION_TRANSPORT_MEDIA,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/gate-entry-modal/types/gate-entry-modal.types";
import { validateOnlyLettersWithAccentsAndDiacritics } from "@app/shared/utils/string.utils";
import { useMemo, useState } from "react";
import { DocumentEnum, type DocumentType } from "@app/core/enums/document.enum";

export function VehicleDataStep({
	register,
	setValue,
	watch,
	errors,
	documentType,
	onChangeDocumentType,
	vehicleOptions = [],
}: VehicleDataStepProps) {
	const [selectedModality, setSelectedModality] = useState<"reception" | "dispatch">("reception");
	const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(documentType);
	const [selectedMedioOption, setSelectedMedioOption] = useState<string>(RECEPTION_TRANSPORT_MEDIA[0].value);
	const transportUnitId = watch("transportUnitId");

	const transportMedia =
		selectedModality === "reception"
			? RECEPTION_TRANSPORT_MEDIA
			: DISPATCH_TRANSPORT_MEDIA;

	const vehicleDropdownOptions = useMemo(
		() =>
			vehicleOptions.map((vehicle) => ({
				value: vehicle.id,
				label: vehicle.name,
			})),
		[vehicleOptions],
	);

	const handleModalityChange = (modality: "reception" | "dispatch") => {
		setSelectedModality(modality);

		const defaultMedio =
			modality === "reception"
				? RECEPTION_TRANSPORT_MEDIA[0].value
				: DISPATCH_TRANSPORT_MEDIA[0].value;

		setSelectedMedioOption(defaultMedio);
		setValue("medio", defaultMedio, { shouldValidate: true, shouldDirty: true });
	};

	const handleMedioChange = (value: string) => {
		setSelectedMedioOption(value);
		setValue("medio", value, { shouldValidate: true, shouldDirty: true });
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3 px-2">
			<div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-3">
				<div className="flex flex-col">
					<span>Modalidad de acceso</span>
					<div className="flex flex-row gap-4 items-center h-12">
						<RadioButton
							label="Para Recepción"
							value="reception"
							checked={selectedModality === "reception"}
							onChange={() => handleModalityChange("reception")}
						/>

						<RadioButton
							label="Para Despacho"
							value="dispatch"
							checked={selectedModality === "dispatch"}
							onChange={() => handleModalityChange("dispatch")}
						/>
					</div>
				</div>

				{selectedModality === "reception" && (
					<div className="flex flex-col">
						<span>Tipo de documento</span>
						<div className="flex flex-row gap-4 items-center h-12">
							<RadioButton
								label="DUCA-T"
								value={DocumentEnum.DUCA.value}
								checked={selectedDocumentType === DocumentEnum.DUCA}
								onChange={() => {
									setSelectedDocumentType(DocumentEnum.DUCA);
									onChangeDocumentType(DocumentEnum.DUCA);
								}}
							/>

							<RadioButton
								label="Declaración Aduanera"
								value={DocumentEnum.CustomsDeclaration.value}
								checked={selectedDocumentType === DocumentEnum.CustomsDeclaration}
								onChange={() => {
									setSelectedDocumentType(DocumentEnum.CustomsDeclaration);
									onChangeDocumentType(DocumentEnum.CustomsDeclaration);
								}}
							/>
						</div>
					</div>
				)}

				<div className={`flex flex-col ${selectedModality === "dispatch" ? "col-span-2" : ""} `}>
					<span>Medio de transporte</span>
					<div className="flex flex-row flex-wrap gap-4 items-center min-h-12">
						{transportMedia.map((media) => (
							<RadioButton
								key={media.value}
								label={media.label}
								value={media.value}
								checked={selectedMedioOption === media.value}
								onChange={() => handleMedioChange(media.value)}
							/>
						))}
					</div>
					{errors.medio?.message && (
						<span className="text-[12px] text-red-500 mt-1">{errors.medio.message}</span>
					)}
				</div>
			</div>

			<div className="sm:col-span-2 lg:col-span-3">
				<Dropdown
					label="Unidad de transporte"
					appearance="dark"
					isRequired
					placeholder="Seleccione una unidad"
					options={vehicleDropdownOptions}
					value={transportUnitId}
					onChange={(value) =>
						setValue("transportUnitId", String(value), {
							shouldValidate: true,
							shouldDirty: true,
						})
					}
					error={errors.transportUnitId?.message}
					labelClassName={gateEntryLabelClassName}
				/>
			</div>

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
		</div>
	);
}
