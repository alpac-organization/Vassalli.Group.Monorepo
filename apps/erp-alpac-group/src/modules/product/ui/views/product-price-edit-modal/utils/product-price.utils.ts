
import {type CatalogLinkTierForm,} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import dayjs from "dayjs";

export const loadMotionFeatures = () =>
	import("framer-motion").then((res) => res.domAnimation);

export const toDayjsValue = (value: string) => {
	if (!value.trim()) return null;
	const parsed = dayjs(value);
	return parsed.isValid() ? parsed : null;
};

export const toDateString = (value: unknown) => {
	if (!value) return "";
	const parsed = dayjs.isDayjs(value) ? value : dayjs(value as string | Date);
	return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

export const formatPreferentialTitle = (item: CatalogLinkTierForm) => {
	if (item.min_quantity.trim() && item.preferential_price.trim()) {
		return `Desde ${item.min_quantity} · ${item.preferential_price} ${item.currency}`;
	}
	return "Precio preferencial";
};