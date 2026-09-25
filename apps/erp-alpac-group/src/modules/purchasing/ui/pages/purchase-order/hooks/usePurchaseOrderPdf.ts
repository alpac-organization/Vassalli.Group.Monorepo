import { useCallback, useRef, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { fetchAndOpenPurchaseOrderPdf } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/purchase-order-pdf.generate";

type GeneratePurchaseOrderPdfArgs = {
	purchaseOrderId: string;
	purchaseRequestId?: string;
};

export function usePurchaseOrderPdf() {
	const { companyId, moduleCode } = useUserStore();
	const [isGenerating, setIsGenerating] = useState(false);
	const isGeneratingRef = useRef(false);

	const generatePurchaseOrderPdf = useCallback(
		async ({ purchaseOrderId, purchaseRequestId }: GeneratePurchaseOrderPdfArgs) => {
			if (isGeneratingRef.current) return;
			if (!purchaseOrderId.trim()) {
				throw new Error("No se encontró la orden de compra.");
			}

			isGeneratingRef.current = true;
			setIsGenerating(true);

			try {
				await fetchAndOpenPurchaseOrderPdf({
					companyId,
					moduleCode,
					purchaseOrderId,
					purchaseRequestId,
				});
			} finally {
				isGeneratingRef.current = false;
				setIsGenerating(false);
			}
		},
		[companyId, moduleCode],
	);

	return { isGenerating, generatePurchaseOrderPdf };
}
