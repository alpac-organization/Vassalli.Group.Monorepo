import { useEffect } from "react";

import {
	Accordion,
	Button,
	Checkbox,
	Dropdown,
	InputText,
	Modal,
} from "@alpac/design-system";

import {
	formatAmount,
	validateDecimalNumber,
	validateIntegerNumber,
	validatePositiveNumber,
} from "@app/shared/utils/number.utils";

import {
	inputClassName,
	dropdownClassName,
	labelClassName,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";

import {
	parseDecimal,
	overflowAccordionTransition,
} from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/utils/style.sections";

import { useSection } from "@app/modules/admin-warehouse/warehouse-managua/ui/hooks/useSection";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, Layers } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { SectionStorageTypeEnum, SectionStorageTypeOptions } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-storage-type";
import { SectionTypeEnum, SectionTypeOptions } from "@app/modules/admin-warehouse/warehouse-managua/enum/section-type";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useMappedError } from "@app/shared/hooks/useMappedError";

import type { FormValues } from "@app/modules/admin-warehouse/warehouse-managua/ui/pages/sections/components/section-modal/section-modal.types";
import type { SectionModalProps } from "./section-modal.types";
import type { RegisterSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/register-section-req";
import type { UpdateSectionRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/update-section-req";
import type { GetSectionDetailsRequest } from "@app/modules/admin-warehouse/warehouse-managua/domain/ApiContract/requests/sections/get-section-details-req";

export const SectionModal = ({
	isOpen,
	warehouseId,
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
		AlertComponent
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
		defaultValues: {
			code: "",
			section_type: SectionTypeEnum.Storage.value,
			section_storage_type: SectionStorageTypeEnum.Empty.value,
			allows_storage_aisle: false,
			maximum_number_of_pallets_per_level: null,
		},
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
	const allowsStorageAisle = watch("allows_storage_aisle");

	useEffect(() => {
		if (!isAisle) {
			setValue("allows_storage_aisle", false);
			setValue("maximum_number_of_pallets_per_level", null);
			clearErrors(["allows_storage_aisle", "maximum_number_of_pallets_per_level"]);
		}
	}, [isAisle, setValue, clearErrors]);

	useEffect(() => {
		if (!allowsStorageAisle) {
			setValue("maximum_number_of_pallets_per_level", null);
			clearErrors("maximum_number_of_pallets_per_level");
		}
	}, [allowsStorageAisle, setValue, clearErrors]);

	useEffect(() => {
		if (!isOpen) {
			reset();
			return;
		}

		if (!section) return;

		reset({
			code: section.section_code ?? "",
			section_type: section.section_type ?? SectionTypeEnum.Storage.value,
			section_storage_type:
				section.section_storage_type ?? SectionStorageTypeEnum.Empty.value,
			width_metres: undefined,
			length_metres: undefined,
			allows_storage_aisle: false,
			maximum_number_of_pallets_per_level: null,
		});
	}, [isOpen, section, reset]);

	useEffect(() => {
		if (!isEdit || !GetSectionDetails.data?.capacity) return;

		const { capacity, section_code } = GetSectionDetails.data;

		console.log("Revisando respuesta:", GetSectionDetails.data);

		if (section_code != null) {
			setValue("code", section_code);
		}


		
		setValue("width_metres", capacity.width);
		setValue("length_metres", capacity.length);
	}, [isEdit, GetSectionDetails.data, setValue]);

	const handleCreateSection = (data: FormValues) => {

		const sectionType = Number(data.section_type) || SectionTypeEnum.Storage.value;
		const isAislePayload = sectionType === SectionTypeEnum.Aisle.value;
		const allows = isAislePayload && data.allows_storage_aisle === true;

		const sectionTypeOption = Object.values(SectionTypeEnum).find(
			(option) => option.value === Number(data.section_type),
		);

		const storageTypeOption = Object.values(SectionStorageTypeEnum).find(
			(option) => option.value === Number(data.section_storage_type),
		);

		const payload: RegisterSectionRequest = {
			company_id: companyId,
			module_code: moduleCode,
			warehouse_id: warehouseId,
			code: data.code,

			section_type: sectionTypeOption
				? sectionTypeOption.value
				: SectionTypeEnum.Storage.value,
			section_storage_type: storageTypeOption
				? storageTypeOption.value
				: SectionStorageTypeEnum.Empty.value,
			width: data.width_metres ?? 0,
			length: data.length_metres ?? 0,
			allows_storage_aisle: isAislePayload ? allows : null,
			maximum_number_of_pallets_per_level:
				allows && data.maximum_number_of_pallets_per_level
					? Number(data.maximum_number_of_pallets_per_level)
					: null,
		};

		RegisterSection.mutate(payload, {
			onSuccess() {
				handleRequestSuccess("Sección registrada exitosamente.");
				reset();
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
				reset();
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
		reset();
		onClose();
	};

	const isPending =
		RegisterSection.isPending ||
		UpdateSection.isPending ||
		(isEdit && GetSectionDetails.isFetching);

	return (
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
				onSubmit={handleSubmit(isEdit ? handleUpdateSection : handleCreateSection)}
			>
				{AlertComponent}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Controller
						control={control}
						name="code"
						rules={
							isEdit
								? undefined
								: {
									required: "El código es requerido",
									maxLength: {
										value: 50,
										message: "El código no puede superar los 50 caracteres.",
									},
								}
						}
						render={({ field }) => (
							<InputText
								label="Código"
								isRequired={!isEdit}
								disabled={isEdit}
								className={inputClassName}
								labelClassName={labelClassName}
								value={field.value ?? ""}
								onChange={field.onChange}
								error={errors.code?.message}
							/>
						)}
					/>

					<Controller
						control={control}
						name="section_type"
						rules={isEdit ? undefined : { required: "El tipo de sección es requerido" }}
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
								onChange={(val) => field.onChange(val)}
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
										if (
											isAisle &&
											Number(value) === SectionStorageTypeEnum.Racks.value
										) {
											return "Una sección de tipo pasillo no admite almacenamiento en racks.";
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
								options={
									isAisle
										? SectionStorageTypeOptions.filter(
											(option) =>
												option.value !== SectionStorageTypeEnum.Racks.value,
										)
										: SectionStorageTypeOptions
								}
								value={field.value}
								appearance="dark"
								className={dropdownClassName}
								labelClassName={labelClassName}
								onChange={(val) => field.onChange(val)}
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
						{...register("width_metres", {
							required: "El ancho es requerido",
							validate: {
								validateDecimal: (value) =>
									!value || validateDecimalNumber(value),
								validatePositive: (value) =>
									!value || validatePositiveNumber(value),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
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
						{...register("length_metres", {
							required: "El largo es requerido",
							validate: {
								validateDecimal: (value) =>
									!value || validateDecimalNumber(value),
								validatePositive: (value) =>
									!value || validatePositiveNumber(value, true),
							},
							setValueAs: parseDecimal,
							onChange: (evt) => {
								evt.target.value = formatAmount(evt.target.value, 10, 2);
							},
						})}
						error={errors.length_metres?.message}
					/>
				</div>

				<AnimatePresence initial={false}>
					{!isEdit && isAisle ? (
						<m.div
							key="overflow-capacity-accordion"
							initial={{ opacity: 0, y: 10, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto" }}
							exit={{ opacity: 0, y: 8, height: 0 }}
							transition={overflowAccordionTransition}
							className="mx-2 overflow-hidden sm:mx-0"
						>
							<Accordion
								title={
									<span className="flex min-w-0 items-center gap-2">
										<Layers
											className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-300"
											aria-hidden
										/>
										<span>Almacenamiento en pasillo</span>
									</span>
								}
								defaultOpen
								icon={ChevronDown}
								className="rounded-md! border! border-slate-300! bg-transparent! dark:border-slate-600! dark:bg-[#272b34]! dark:hover:border-neutral-600!"
								triggerClassName="h-auto! min-h-10! rounded-md! bg-transparent! px-3! py-2.5! sm:px-4! dark:bg-transparent! hover:bg-slate-50! dark:hover:bg-white/5!"
								contentClassName="border-t border-slate-300 px-3 py-3 sm:px-4 sm:py-4 dark:border-slate-600"
							>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									<Controller
										control={control}
										name="allows_storage_aisle"
										render={({ field }) => (
											<Checkbox
												label="Permite almacenamiento en pasillo"
												labelPosition="right"
												className="text-slate-300!"
												checked={field.value ?? false}
												onChange={field.onChange}
											/>
										)}
									/>

									<InputText
										label="Máximo de polines"
										type="text"
										inputMode="numeric"
										placeholder="0"
										disabled={!allowsStorageAisle}
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
								</div>
							</Accordion>
						</m.div>
					) : null}
				</AnimatePresence>

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
	);
};
