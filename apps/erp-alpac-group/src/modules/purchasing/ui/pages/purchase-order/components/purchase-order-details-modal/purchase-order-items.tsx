import { useState } from "react";
import type { PurchaseOrderDetailItem } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-order-details-response";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { PurchaseOrderItemAccordionRow } from "@app/modules/purchasing/ui/pages/purchase-order/components/purchase-order-details-modal/purchase-order-item-accordion-row";

type PurchaseOrderItemsProps = {
	items: PurchaseOrderDetailItem[];
	productByItemId: ReadonlyMap<string, PurchaseRequestProductInformation>;
};

export const PurchaseOrderItems = ({
	items,
	productByItemId,
}: PurchaseOrderItemsProps) => {
	const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

	if (items.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500 dark:border-neutral-700 dark:text-slate-400">
				No hay productos en esta orden.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 dark:border-neutral-700">
			<div className="flex flex-col divide-y divide-slate-100 dark:divide-neutral-700">
				{items.map((item) => {
					const rowKey = item.purchase_order_item_id;
					const isOpen = Boolean(openRows[rowKey]);
					const requestItemId = item.purchase_request_item_id?.trim() || "";

					return (
						<PurchaseOrderItemAccordionRow
							key={rowKey}
							item={item}
							isOpen={isOpen}
							requestProduct={
								requestItemId
									? productByItemId.get(requestItemId)
									: undefined
							}
							onToggle={() => {
								setOpenRows((current) => ({
									...current,
									[rowKey]: !current[rowKey],
								}));
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
