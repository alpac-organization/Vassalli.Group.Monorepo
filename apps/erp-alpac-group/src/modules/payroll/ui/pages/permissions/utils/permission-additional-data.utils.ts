import type {
  MedicalAppointmentImageAttachment,
  PermissionAdditionalData,
} from "@app/modules/payroll/domain/ApiContract/Responses/permission-responses/permission-history-response";
import type { ImagePayload } from "@app/shared/components/image-preview-gallery/image-preview-gallery";

export function parsePermissionAdditionalData(
  additionalData?: string,
): PermissionAdditionalData | null {
  if (!additionalData?.trim()) return null;
  try {
    return JSON.parse(additionalData) as PermissionAdditionalData;
  } catch {
    return null;
  }
}

function mapMedicalAppointmentImage(
  image: MedicalAppointmentImageAttachment,
): ImagePayload | null {
  const image_base64 = image.ImageBase64?.trim();
  if (!image_base64) return null;

  return {
    image_base64,
    content_type: image.ContentType ?? "image/jpeg",
  };
}

export function extractMedicalAppointmentImages(
  additionalData?: string,
): ImagePayload[] {
  const additional = parsePermissionAdditionalData(additionalData);
  const attached = additional?.MedicalAppointmentData?.ImagesAttached;

  if (!Array.isArray(attached) || attached.length === 0) return [];

  return attached
    .map(mapMedicalAppointmentImage)
    .filter((image): image is ImagePayload => image !== null);
}
