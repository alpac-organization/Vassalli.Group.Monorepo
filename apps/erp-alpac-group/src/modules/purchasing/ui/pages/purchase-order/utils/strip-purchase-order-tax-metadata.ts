const TAX_METADATA_MARKER = "---TAX---";

export function stripPurchaseOrderTaxMetadata(
	comments?: string | null,
): string {
	if (!comments) return "";

	const markerIndex = comments.indexOf(TAX_METADATA_MARKER);
	if (markerIndex === -1) return comments.trim();

	return comments.slice(0, markerIndex).trim();
}
