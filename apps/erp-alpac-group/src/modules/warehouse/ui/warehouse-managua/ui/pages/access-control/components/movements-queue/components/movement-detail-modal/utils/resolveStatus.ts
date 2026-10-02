import { DocumentEnum } from "@app/core/enums/document.enum";

type ResolveLabelDocumentType = { label?: string };

export function resolveDocumentTypeLabel(documentType: unknown): string {
  if (documentType == null) return "";
  if (typeof documentType === "object" && documentType !== null && "label" in documentType) {
    return (documentType as ResolveLabelDocumentType).label ?? "";
  }

  const str = String(documentType).trim();
  if (str === "") return "";

  const num = Number(str);
  if (!Number.isNaN(num)) {
    const matchByValue = Object.values(DocumentEnum).find(
      (item) => Number(item.value) === num,
    );
    if (matchByValue) return matchByValue.label;
  }

  const matchByKey = DocumentEnum[str];
  if (matchByKey) return matchByKey.label;

  const normalizedInput = str.toLowerCase();
  const flexibleMatch = Object.entries(DocumentEnum).find(
    ([key, item]) =>
      key.toLowerCase() === normalizedInput ||
      item.label.toLowerCase() === normalizedInput,
  );

  if (flexibleMatch) {
    return flexibleMatch[1].label;
  }

  return str;
}
