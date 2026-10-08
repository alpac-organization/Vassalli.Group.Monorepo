import { Button } from "@alpac/design-system";
import { XIcon } from "lucide-react";
import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type { AdditionalDataDocumentNumber } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import type { GetOperationalOrderDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/operational-orders/get-operational-order-detail-response";
import { GeneralInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/general-information-section";
import { CustomerInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/customer-information-section";
import { ReceptionInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/reception-information-section";
import { TransportInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/transport-information-section";
import { EvidenceInformationSection } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/components/evidence-information-section";

type OperationalOrderDetailBodyProps = {
	detail: GetOperationalOrderDetailResponse;
	documentNumbers: AdditionalDataDocumentNumber[];
	evidenceImages: ImagePayload[];
	onClose: () => void;
};

export function OperationalOrderDetailBody({
	detail,
	documentNumbers,
	evidenceImages,
	onClose,
}: OperationalOrderDetailBodyProps) {
	const receptionInfo = detail.reception_entrance_information;
	const transportInfo =
		receptionInfo?.reception_transport_entrance_information;

	return (
		<>
			<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pr-1">
				<div className="flex flex-col gap-5 pb-2">
					<GeneralInformationSection detail={detail} />
					<CustomerInformationSection
						customer={detail.customer_information}
					/>
					{receptionInfo ? (
						<ReceptionInformationSection
							receptionInfo={receptionInfo}
							isConsolidated={detail.is_consolidated}
							documentNumbers={documentNumbers}
						/>
					) : null}
					{transportInfo ? (
						<TransportInformationSection transportInfo={transportInfo} />
					) : null}
					<EvidenceInformationSection images={evidenceImages} />
				</div>
			</div>

			<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
					<Button
						type="button"
						label="Cerrar"
						size="giant"
						isHiddenLabelOnMobile
						icon={<XIcon size={20} />}
						onClick={onClose}
						className="text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!"
					/>
				</div>
			</div>
		</>
	);
}
