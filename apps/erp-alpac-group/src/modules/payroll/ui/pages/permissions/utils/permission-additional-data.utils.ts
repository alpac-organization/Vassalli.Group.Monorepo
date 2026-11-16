import type {
  EvidenceImage,
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

function toImagePayload(image: EvidenceImage): ImagePayload | null {
  const imageBase64 = image.ImageBase64?.trim();
  if (!imageBase64) return null;

  return {
    image_base64: imageBase64,
    content_type: image.ContentType?.trim() || "image/jpeg",
  };
}

function mapEvidence(images: EvidenceImage[] | undefined): ImagePayload[] {
  if (!images?.length) return [];

  return images
    .map(toImagePayload)
    .filter((image): image is ImagePayload => image !== null);
}

export function extractMedicalAppointmentImages(
  additional: PermissionAdditionalData | null,
): ImagePayload[] {
  return mapEvidence(additional?.MedicalAppointmentData?.ImagesAttached);
}

export function extractLeaveImages(
  additional: PermissionAdditionalData | null,
): ImagePayload[] {
  return mapEvidence(additional?.LeaveEvidenceData?.Evidence);
}
