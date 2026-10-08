import { Badges } from "@alpac/design-system";
import { FileText, Package } from "lucide-react";
import { DetailField } from "@app/shared/components/detail-field/detail-field";
import type { AdditionalDataDocumentNumber } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { sectionTitleClassName } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/utils/styles";
import {
	formatDocumentBadgeLabel,
	getConsolidatedBadge,
} from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/ongoing-operations/components/operational-order-detail-modal/utils/operational-order-detail.utils";

type ConsolidatedInformationSectionProps = {
	isConsolidated: boolean | null | undefined;
	documentNumbers: AdditionalDataDocumentNumber[];
};

export function ConsolidatedInformationSection({
	isConsolidated,
	documentNumbers,
}: ConsolidatedInformationSectionProps) {
	const hasDocuments = documentNumbers.length > 0;
	if (!hasDocuments && isConsolidated == null) return null;

	const consolidatedBadge =
		isConsolidated == null ? null : getConsolidatedBadge(isConsolidated);

	return (
		<div className="mt-1 flex flex-col gap-3">
			<h4 className={sectionTitleClassName}>Información del consolidado</h4>
			<div className="grid grid-cols-1 p-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DetailField
					label="Es consolidado"
					icon={<Package size={18} />}					
					value={
						consolidatedBadge ? (
							<Badges
								label={consolidatedBadge.label}
								color="transparent"
								className={consolidatedBadge.className}
								
							/>
						) : (
							"—"
						)
					}
				/>

				{hasDocuments ? (
					<DetailField
						label={`Documentos relacionados al consolidado (${documentNumbers.length})`}
						icon={<FileText size={18} />}
						containerClass="sm:col-span-2 lg:col-span-2"
						value={
							<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
								{documentNumbers.map((doc, idx) => (
									<Badges
										key={doc.document_id || idx}
										label={formatDocumentBadgeLabel(doc)}
										color="transparent"
										className="bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 px-3! py-1! font-medium"
									/>
								))}
							</div>
						}
					/>
				) : null}
			</div>
		</div>
	);
}
