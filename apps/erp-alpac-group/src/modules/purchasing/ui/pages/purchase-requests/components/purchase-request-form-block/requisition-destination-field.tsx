import { memo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Dropdown } from "@alpac/design-system";
import { PurchaseRequestDestinationEnum } from "@app/modules/purchasing/domain/enums/purchase-request-destination.enum";
import type { CreatePurchaseRequestPayload } from "@app/modules/purchasing/domain/ApiContract/Requests/purchase/create-purchase-request-payload";

const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";

const requisitionDestinationOptions = [
	{
		value: PurchaseRequestDestinationEnum.Internal.textValue,
		label: PurchaseRequestDestinationEnum.Internal.label,
	},
	{
		value: PurchaseRequestDestinationEnum.ServiceOrder.textValue,
		label: PurchaseRequestDestinationEnum.ServiceOrder.label,
	},
];

const destinationOptionsWithExternal = [
	...requisitionDestinationOptions,
	{
		value: PurchaseRequestDestinationEnum.Client.textValue,
		label: PurchaseRequestDestinationEnum.Client.label,
	},
];

type RequisitionDestinationFieldProps = {
	isEditMode: boolean;
	hasAttemptedSubmit: boolean;
};

export const RequisitionDestinationField = memo(function RequisitionDestinationField({
	isEditMode,
	hasAttemptedSubmit,
}: RequisitionDestinationFieldProps) {
	const {
		control,
		trigger,
		formState: { errors },
	} = useFormContext<CreatePurchaseRequestPayload>();
	const items = useWatch({ control, name: "purchase_request_items" });
	const destination = useWatch({ control, name: "destination" });
	const isLocked = isEditMode || (items?.length ?? 0) > 0;
	const options =
		destination === PurchaseRequestDestinationEnum.Client.textValue
			? destinationOptionsWithExternal
			: requisitionDestinationOptions;

	return (
		<div className="min-w-0 w-full">
			<Controller
				name="destination"
				control={control}
				rules={{
					required: "El tipo de uso es requerido",
					validate: (value) => Boolean(value) || "El tipo de uso es requerido",
				}}
				render={({ field }) => (
					<Dropdown
						label="Tipo de uso"
						isRequired
						appearance="dark"
						placeholder="Seleccione el tipo de uso"
						value={field.value}
						disabled={isLocked}
						onChange={(value) => {
							if (isLocked) return;
							field.onChange(value);
							if (hasAttemptedSubmit) {
								void trigger("destination");
							}
						}}
						options={options}
						labelClassName={labelClassName}
						valueClassName={labelClassName}
						className={dropdownClassName}
						error={errors.destination?.message}
					/>
				)}
			/>
		</div>
	);
});
