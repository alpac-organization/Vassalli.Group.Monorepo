import {
	ProductQualityOptions,
} from "@app/modules/purchasing/domain/enums/product-quality";
import {
	TimeTypeEnum,
	TimeTypeOptions,
} from "@app/core/enums/time-type.enum";

export const productQualityOptions = ProductQualityOptions.map((option) => ({
	value: option.textValue,
	label: option.label,
}));

export const deliveryTimeOptions = TimeTypeOptions.filter(
	(option) => option.value !== TimeTypeEnum.Year.stringValue,
);

export const timeTypeOptions = TimeTypeOptions;

export const conditionalFieldsGridClassName =
	"mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2";
