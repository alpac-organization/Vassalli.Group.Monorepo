import { DocumentEnum } from "@app/core/enums/document.enum";

type ResolveLabelDocumentType = { label?: string };

export function resolveDocumentTypeLabel(documentType: unknown): string {
  if (documentType == null || typeof documentType !== "string") {
    if (typeof documentType === "object" && documentType !== null) {
      return (documentType as ResolveLabelDocumentType).label ?? "";
    }
    return String(documentType ?? "");
  }

  const rawKey = documentType.trim();
  if (rawKey === "") return "";

  const matchByKey = DocumentEnum[rawKey];
  if (matchByKey) {
    return matchByKey.label;
  }

  const normalizedInput = rawKey.toLowerCase();
  const flexibleMatch = Object.entries(DocumentEnum).find(
    ([key, item]) =>
      key.toLowerCase() === normalizedInput ||
      item.label.toLowerCase() === normalizedInput,
  );

  if (flexibleMatch) {
    return flexibleMatch[1].label;
  }

  return rawKey;
}
