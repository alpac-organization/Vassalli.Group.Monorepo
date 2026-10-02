import { useEffect } from "react";

import {
	Button,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";

import {
	formatAmount,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";
import { getDecimalFieldConfig } from "@app/shared/utils/get-decimal.config";

import {
	inputClassName,
	dropdownClassName,
	labelClassName,
	parseDecimal,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";

import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { Controller, useForm } from "react-hook-form";
import {
	SectionStorageTypeEnum,
	SectionStorageTypeOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import {
	SectionTypeEnum,
	SectionTypeOptions,
} from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import {
	resolveSectionStorageType,
	resolveSectionType,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/section-status-badge";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { Loader } from "@app/shared/components/loaders/loader";
import { isInsideAvailableArea } from "@app/modules/admin-warehouse/warehouse-managua/ui/utils/layout-bound";

import type {
	FormValues,
	SectionModalProps,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal.types";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";

const aisleStorageOptions = SectionStorageTypeOptions.filter(
	(option) =>
		option.value === SectionStorageTypeEnum.Pallets.value ||
		option.value === SectionStorageTypeEnum.None.value,
);

const storageSectionOptions = SectionStorageTypeOptions.filter(
	(option) =>
		option.value === SectionStorageTypeEnum.Racks.value ||
		option.value === SectionStorageTypeEnum.Lots.value
);

const createDefaultValues = (): FormValues => ({
	section_type: Number(SectionTypeEnum.Storage.value),
	section_storage_type: Number(SectionStorageTypeEnum.Racks.value),
	allows_storage_aisle: false,
	maximum_number_of_pallets_per_level: null,
	width_metres: 0,
	length_metres: 0,
	code: "",
	position_x: 0,
	position_y: 0,
	position_z: 0,
	rotation_y: 0
});

export const SectionModal = ({
	isOpen,
	warehouseId,
	warehouse,
	section = null,
	onClose,
	onSubmit,
}: SectionModalProps) => {
	const isEdit = section != null;

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();
	const {
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
		AlertComponent,
	} = useAlertState();

	const {
		control,
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		clearErrors,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: createDefaultValues(),
	});

	let getSectionDetailsPayload: GetSectionDetailsRequest | undefined;

	if (isOpen && section) {
		getSectionDetailsPayload = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: section.section_id,
		};
	}

	const { RegisterSection, UpdateSection, GetSectionDetails } = useSection({
		getSectionDetailsPayload,
	});

	const isAisle = Number(watch("section_type")) === SectionTypeEnum.Aisle.value;
	const sectionStorageType = Number(watch("section_storage_type"));
	const isPallets =
		sectionStorageType === SectionStorageTypeEnum.Pallets.value;
	const allowsStorageAisle = isAisle && isPallets;

	useEffect(() => {
		const isRacksOrLots =
			sectionStorageType === SectionStorageTypeEnum.Racks.value ||
			sectionStorageType === SectionStorageTypeEnum.Lots.value;

		if (!isAisle) {
			setValue("allows_storage_aisle", false);
			setValue("maximum_number_of_pallets_per_level", null);
			clearErrors("maximum_number_of_pallets_per_level");

			if (!isRacksOrLots) {
				setValue(
					"section_storage_type",
					Number(SectionStorageTypeEnum.Racks.value),
				);
				clearErrors("section_storage_type");
			}
			return;
		}

		if (isRacksOrLots) {
			setValue(
				"section_storage_type",
				Number(SectionStorageTypeEnum.None.value),
			);
			setValue("allows_storage_aisle", false);
			setValue("maximum_number_of_pallets_per_level", null);
			clearErrors(["section_storage_type", "maximum_number_of_pallets_per_level"]);
			return;
		}

		const allows = sectionStorageType === SectionStorageTypeEnum.Pallets.value;
		setValue("allows_storage_aisle", allows);

		if (!allows) {
			setValue("maximum_number_of_pallets_per_level", null);
			clearErrors("maximum_number_of_pallets_per_level");
		}
	}, [isAisle, sectionStorageType, setValue, clearErrors]);

	useEffect(() => {
		if (!isOpen) {
			reset(createDefaultValues());
			return;
		}

		if (!section) {
			reset(createDefaultValues());
			return;
		}

		const resolvedType = section.section_type
			? resolveSectionType(section.section_type)
			: undefined;
		const resolvedStorage = section.section_storage_type
			? resolveSectionStorageType(section.section_storage_type)
			: undefined;

		reset({
			code: section.section_code ?? "",
			section_type: Number(
				resolvedType?.value ?? SectionTypeEnum.Storage.value,
			),
			section_storage_type: Number(
				resolvedStorage?.value ?? SectionStorageTypeEnum.Racks.value,
			),
			width_metres: undefined,
			length_metres: undefined,
			allows_storage_aisle: false,
			maximum_number_of_pallets_per_level: null,
		});
	}, [isOpen, section, reset]);

	useEffect(() => {
		if (!isEdit || !GetSectionDetails.data) return;

		const details = GetSectionDetails.data;
		const resolvedType = resolveSectionType(details.section_type);
		const resolvedStorage = resolveSectionStorageType(
			details.section_storage_type,
		);

		if (details.section_code != null) {
			setValue("code", details.section_code);
		}

		if (resolvedType) {
			setValue("section_type", Number(resolvedType.value));
		}

		if (resolvedStorage) {
			setValue("section_storage_type", Number(resolvedStorage.value));
		}

		if (details.capacity) {
			setValue("width_metres", details.capacity.width);
			setValue("length_metres", details.capacity.length);
		}
	}, [isEdit, GetSectionDetails.data, setValue]);

	const handleCreateSection = (data: FormValues) => {

		const sectionType =
			Number(data.section_type) || Number(SectionTypeEnum.Storage.value);
		const storageType = Number(data.section_storage_type);
		const isAislePayload = sectionType === SectionTypeEnum.Aisle.value;
		const isRacksOrLots =
			storageType === SectionStorageTypeEnum.Racks.value ||
			storageType === SectionStorageTypeEnum.Lots.value;
		const allows =
			isAislePayload &&
			storageType === SectionStorageTypeEnum.Pallets.value;

		if (isAislePayload && isRacksOrLots) {
			handleRequestError(
				"Una sección de tipo pasillo no admite almacenamiento en racks o tramos.",
			);
			return;
		}

		if (!isAislePayload && !isRacksOrLots) {
			handleRequestError(
				"Una sección de tipo almacenamiento solo admite racks o tramos.",
			);
			return;
		}

		const maxPallets =
			allows && data.maximum_number_of_pallets_per_level != null
				? Number(data.maximum_number_of_pallets_per_level)
				: null;

		if (allows && (maxPallets == null || maxPallets <= 0)) {
			handleRequestError(
				"Si el pasillo permite almacenamiento, el número máximo de polines por nivel debe ser mayor a cero.",
			);
			return;
		}

		const positionX = data.position_x ?? 0;
		const positionY = data.position_y ?? 0;
		const sectionWidth = data.width_metres ?? 0;
		const sectionLength = data.length_metres ?? 0;

		if (
			warehouse &&
			!isInsideAvailableArea(
				{ x: positionX, y: positionY, width: sectionWidth, length: sectionLength },
				{
					width: warehouse.width - warehouse.margin_left - warehouse.margin_right,
					length: warehouse.length - warehouse.margin_top - warehouse.margin_bottom,
					marginTop: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
				},
			)
		) {
			handleRequestError(
				"La sección debe quedar dentro del área disponible de la bodega.",
			);
			return;
		}

		const payload: RegisterSectionRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_type: sectionType,
			section_storage_type: storageType,
			width: sectionWidth,
			length: sectionLength,
			maximum_number_of_pallets_per_level: allows ? maxPallets : null,
			position_x: positionX,
			position_y: positionY,
			position_z: 0,
			rotation_y: 0,
		};

		RegisterSection.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Sección registrada exitosamente.");
				reset(createDefaultValues());
				onSubmit?.(payload);
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
	};

	const handleUpdateSection = (data: FormValues) => {
		if (!section) return;

		const payload: UpdateSectionRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			section_id: section.section_id,
			width: data.width_metres ?? 0,
			length: data.length_metres ?? 0,
		};

		UpdateSection.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Sección actualizada exitosamente.");
				reset(createDefaultValues());
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				handleRequestError(mappedError.description);
			},
		});
	};

	const handleClose = () => {
		handleCloseAlert();
		reset(createDefaultValues());
		onClose();
	};

	const isPending =
		RegisterSection.isPending ||
		UpdateSection.isPending ||
		(isEdit && GetSectionDetails.isFetching);

	return (
		<>
			{RegisterSection.isPending && (
				<Loader title="Registrando sección..." />
			)}

			<Modal
				isOpen={isOpen}
				onClose={handleClose}
				title={isEdit ? "Actualizar sección" : "Registro de nueva sección"}
				variant="form"
				size="6xl"
				description={
					isEdit
						? "Actualice el ancho y largo de la sección"
						: "Complete el registro de la sección del almacén"
				}
			>
			<form
				className="flex flex-col gap-5"
				onSubmit={handleSubmit(
					isEdit ? handleUpdateSection : handleCreateSection,
				)}
			>
				{AlertComponent}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{isEdit ? (
						<InputText
							label="Código"
							disabled
							className={inputClassName}
							labelClassName={labelClassName}
							value={watch("code") ?? ""}
						/>
					) : null}

					<Controller
						control={control}
						name="section_type"
						rules={
							isEdit
								? undefined
								: { required: "El tipo de sección es requerido" }
						}
						render={({ field }) => (
							<Dropdown
								label="Tipo de sección"
								placeholder="Seleccione..."
								isRequired={!isEdit}
								disabled={isEdit}
								options={SectionTypeOptions}
								value={field.value}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								onChange={(val) => field.onChange(Number(val))}
								error={errors.section_type?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="section_storage_type"
						rules={
							isEdit
								? undefined
								: {
									required: "El tipo de almacenamiento es requerido",
									validate: (value) => {
										const storageType = Number(value);
										const isRacksOrLots =
											storageType ===
											SectionStorageTypeEnum.Racks.value ||
											storageType === SectionStorageTypeEnum.Lots.value;

										if (isAisle && isRacksOrLots) {
											return "Una sección de tipo pasillo no admite almacenamiento en racks o tramos.";
										}

										if (
											isAisle &&
											storageType !==
											SectionStorageTypeEnum.Pallets.value &&
											storageType !== SectionStorageTypeEnum.None.value
										) {
											return "Un pasillo solo admite almacenamiento en polines o ninguno.";
										}

										if (!isAisle && !isRacksOrLots) {
											return "Una sección de tipo almacenamiento solo admite racks o tramos.";
										}

										return true;
									},
								}
						}
						render={({ field }) => (
							<Dropdown
								label="Tipo de almacenamiento"
								placeholder="Seleccione..."
								isRequired={!isEdit}
								disabled={isEdit}
								options={isAisle ? aisleStorageOptions : storageSectionOptions}
								value={field.value}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								onChange={(val) => field.onChange(Number(val))}
								error={errors.section_storage_type?.message}
							/>
						)}
					/>

					<InputText
						label="Ancho (m)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register(
							"width_metres",
							getDecimalFieldConfig("El ancho es requerido"),
						)}
						error={errors.width_metres?.message}
					/>

					<InputText
						label="Largo (m)"
						type="text"
						inputMode="decimal"
						placeholder="0.00"
						isRequired
						className={inputClassName}
						labelClassName={labelClassName}
						{...register(
							"length_metres",
							getDecimalFieldConfig("El largo es requerido"),
						)}
						error={errors.length_metres?.message}
					/>

					{!isEdit && isAisle && isPallets ? (
						<InputText
							label="Máximo de polines"
							type="text"
							inputMode="numeric"
							placeholder="0"
							isRequired
							className={inputClassName}
							labelClassName={labelClassName}
							{...register("maximum_number_of_pallets_per_level", {
								validate: {
									requiredWhenAllows: (value) => {
										if (!allowsStorageAisle) return true;
										if (value === undefined || value === null) {
											return "Si el pasillo permite almacenamiento, indique el máximo de polines.";
										}
										return true;
									},
									validateInteger: (value) =>
										value === undefined ||
										value === null ||
										validateIntegerNumber(value),
									validatePositive: (value) => {
										if (!allowsStorageAisle) return true;
										if (value === undefined || value === null) return true;
										return validatePositiveNumber(value);
									},
								},
								setValueAs: parseDecimal,
								onChange: (evt) => {
									evt.target.value = formatAmount(evt.target.value, 6, 0);
								},
							})}
							error={errors?.maximum_number_of_pallets_per_level?.message}
						/>
					) : null}
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
						label={isEdit ? "Actualizar" : "Guardar"}
						isLoading={isPending}
						disabled={isPending}
						className="w-full min-w-0 shrink-0 text-[15px]! rounded-md! bg-alpac-primary-500 text-white! sm:w-auto!"
					/>
				</div>
			</form>
			</Modal>
		</>
	);
};
