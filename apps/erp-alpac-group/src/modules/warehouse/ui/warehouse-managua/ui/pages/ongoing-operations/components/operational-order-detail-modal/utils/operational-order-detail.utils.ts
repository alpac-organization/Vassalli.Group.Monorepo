import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";
import type {
	AdditionalDataDocumentNumber,
	AdditionalReceptionEntranceData,
} from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control-detail";
import { TransportUnit } from "@app/modules/warehouse/domain/enums/warehouse-managua/transport-unit";
import { resolveDocumentTypeLabel } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/utils/resolveStatus";
import { ConsolidatedVariations } from "@app/modules/warehouse/ui/warehouse-managua/ui/pages/access-control/components/movements-queue/components/movement-detail-modal/variants/global-variants";

export function resolveTransportUnitLabel(
	value: string | number | null | undefined,
): string {
	if (value == null || value === "") return "—";

	const normalized = String(value).trim().toLowerCase();
	const match = Object.entries(TransportUnit).find(([key, unit]) => {
		return (
			Number(unit.value) === Number(value) ||
			unit.label.toLowerCase() === normalized ||
			key.toLowerCase() === normalized
		);
	});

	return match?.[1].label ?? String(value);
}

export function formatOptionalNumber(
	value: number | null | undefined,
	suffix: string,
): string {
	if (value == null) return "—";
	return `${Number(value).toLocaleString()} ${suffix}`;
}

export function formatDocumentBadgeLabel(
	doc?: AdditionalDataDocumentNumber | null,
): string {
	const documentNumber = doc?.document_numbers?.trim() ?? "";
	const typeLabel = resolveDocumentTypeLabel(doc?.document_type);

	if (documentNumber && typeLabel) return `${documentNumber} · ${typeLabel}`;
	return documentNumber || typeLabel;
}

export function getConsolidatedBadge(isConsolidated: boolean) {
	const variant = isConsolidated
		? ConsolidatedVariations.consolidated
		: ConsolidatedVariations.Unbound;

	return {
		label: variant.label,
		className: `w-fit! px-2.5! py-0.5! text-xs font-semibold ${variant.color}`,
	};
}

export function mapEvidenceImages(
	parsed: AdditionalReceptionEntranceData | null,
): ImagePayload[] {
	return (parsed?.evidence_urls ?? [])
		.map((evidence) => evidence?.image_url ?? evidence?.document_url ?? "")
		.filter(Boolean)
		.map((url) => ({ image_base64: url }));
}

export function buildDetailModalTitle(poCode?: string | null): string {
	return poCode
		? `Orden Operacional — ${poCode}`
		: "Detalle de Orden Operacional";
}
