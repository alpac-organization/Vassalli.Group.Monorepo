import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";

type AdditionalDataRecord = Record<string, unknown>;

const asRecord = (value: unknown): AdditionalDataRecord | null =>
	value && typeof value === "object" && !Array.isArray(value)
		? value as AdditionalDataRecord
		: null;

export function parsePurchaseRequestItemAdditionalData(
	additionalData?: string | null,
): AdditionalDataRecord | null {
	if (!additionalData?.trim()) return null;

	try {
		let parsed = JSON.parse(additionalData) as unknown;

		if (typeof parsed === "string") {
			parsed = JSON.parse(parsed) as unknown;
		}

		return asRecord(parsed);
	} catch {
		return null;
	}
}

const normalizeImage = (image: unknown): ImagePayload | null => {
	if (typeof image === "string") {
		const value = image.trim();
		return value ? { image_base64: value } : null;
	}

	const record = asRecord(image);
	if (!record) return null;

	const value = [
		record.image_base64,
		record.imageBase64,
		record.ImageBase64,
		record.base64,
		record.url,
		record.image_url,
	].find((candidate) => typeof candidate === "string" && candidate.trim());

	if (typeof value !== "string") return null;

	const contentType = [
		record.content_type,
		record.contentType,
		record.ContentType,
	].find((candidate) => typeof candidate === "string" && candidate.trim());

	return {
		image_base64: value.trim(),
		content_type: typeof contentType === "string" ? contentType : undefined,
	};
};

export function extractPurchaseRequestItemImages(
	additionalData?: string | null,
): ImagePayload[] {
	const parsed = parsePurchaseRequestItemAdditionalData(additionalData);
	if (!parsed) return [];

	const images = [
		parsed.images_product_to_changed,
		parsed.imagesProductToChanged,
		parsed.ImagesProductToChanged,
		parsed.images,
		parsed.Images,
	].find(Array.isArray);

	if (!Array.isArray(images) || images.length === 0) return [];

	return images
		.map(normalizeImage)
		.filter((image): image is ImagePayload => image !== null);
}
