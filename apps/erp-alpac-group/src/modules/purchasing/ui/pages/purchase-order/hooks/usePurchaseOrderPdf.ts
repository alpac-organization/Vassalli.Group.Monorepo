import { useCallback, useRef, useState } from "react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { fetchAndOpenPurchaseOrderPdf } from "@app/modules/purchasing/ui/pages/purchase-order/components/reports/purchase-order-pdf/purchase-order-pdf.generate";

type GeneratePurchaseOrderPdfArgs = {
	purchaseOrderId: string;
	/** Nombre de sucursal/compañía para el sello (opcional). */
	branchName?: string | null;
};

export function usePurchaseOrderPdf() {
	const { companyId, moduleCode, companyName } = useUserStore();
	const [isGenerating, setIsGenerating] = useState(false);
	const isGeneratingRef = useRef(false);

	const generatePurchaseOrderPdf = useCallback(
		async ({ purchaseOrderId, branchName }: GeneratePurchaseOrderPdfArgs) => {
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
					branchName: branchName ?? companyName,
				});
			} finally {
				isGeneratingRef.current = false;
				setIsGenerating(false);
			}
		},
		[companyId, moduleCode, companyName],
	);

	return { isGenerating, generatePurchaseOrderPdf };
}
