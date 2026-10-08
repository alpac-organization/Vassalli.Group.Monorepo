import { useMemo } from "react";
import { Modal } from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useOperationalOrders } from "@app/modules/warehouse/ui/hooks/warehouse-managua/useOperationalOrders";
import { parseOperationalOrderAdditionalData } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import type { OperationalOrderDetailModalProps } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/types/operational-order-detail-modal.types";
import { OperationalOrderDetailBody } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/operational-order-detail-body";
import {
	buildDetailModalTitle,
	mapEvidenceImages,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/utils/operational-order-detail.utils";

export function OperationalOrderDetailModal({
	isOpen,
	onClose,
	orderId,
}: OperationalOrderDetailModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const detailPayload = useMemo(
		() =>
			isOpen && orderId && companyId && moduleCode
				? {
						company_id: companyId,
						module_code: moduleCode,
						operational_order_id: orderId,
					}
				: null,
		[isOpen, orderId, companyId, moduleCode],
	);

	const { GetOperationalOrderDetail } = useOperationalOrders({
		detailPayload,
	});

	const { data: detail, isLoading } = GetOperationalOrderDetail;

	const parsedAdditionalData = useMemo(
		() =>
			parseOperationalOrderAdditionalData(
				detail?.reception_entrance_information?.additional_data,
			),
		[detail?.reception_entrance_information?.additional_data],
	);

	const documentNumbers = parsedAdditionalData?.document_numbers ?? [];
	const evidenceImages = useMemo(
		() => mapEvidenceImages(parsedAdditionalData),
		[parsedAdditionalData],
	);

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="px-3 py-16 text-center">
					<Loader title="Cargando detalle de la orden operacional..." />
				</div>
			);
		}

		if (!detail) {
			return (
				<div className="px-3 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
					No se encontró información para la orden operacional seleccionada.
				</div>
			);
		}

		return (
			<OperationalOrderDetailBody
				detail={detail}
				documentNumbers={documentNumbers}
				evidenceImages={evidenceImages}
				onClose={onClose}
			/>
		);
	};

	return (
		<Modal
			isOpen={isOpen && Boolean(orderId)}
			onClose={onClose}
			variant="default"
			size="7xl"
			title={buildDetailModalTitle(detail?.po_code)}
			description="Consulta la información general, cliente, centro de costo y recepción asociada a la orden."
			panelClassName={[
				"flex max-h-[min(94dvh,50rem)] flex-col overflow-hidden",
				"!mx-2 !my-2 sm:!mx-4 sm:!my-6",
				"rounded-xl sm:!rounded-2xl !p-4 sm:!p-6",
			].join(" ")}
			contentClassName="flex min-h-0 flex-1 flex-col"
		>
			<div className="flex min-h-0 min-w-0 flex-1 flex-col">
				{renderContent()}
			</div>
		</Modal>
	);
}
