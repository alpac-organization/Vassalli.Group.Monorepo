import { DocumentEnum } from "@app/core/enums/document.enum";
export function resolveDocumentTypeLabel(documentType: unknown): string {
  if (documentType == null) return "";

  const candidates: string[] = [];
  let numericValue: number | null = null;

  if (typeof documentType === "object") {
    const dt = documentType as { value?: number | string; label?: string };
    if (dt.value != null && String(dt.value).trim() !== "") {
      const asNum = Number(dt.value);
      if (!Number.isNaN(asNum)) numericValue = asNum;
      candidates.push(String(dt.value));
    }
    if (dt.label) candidates.push(String(dt.label));
  } else {
    const raw = String(documentType).trim();
    if (!raw) return "";
    candidates.push(raw);
    const asNum = Number(raw);
    if (!Number.isNaN(asNum)) numericValue = asNum;
  }

  if (numericValue != null) {
    const byValue = Object.values(DocumentEnum).find(
      (item) => Number(item.value) === numericValue,
    );
    if (byValue) return byValue.label;
  }

  for (const candidate of candidates) {
    const byKey = DocumentEnum[candidate];
    if (byKey) return byKey.label;

    const normalized = candidate.trim().toLowerCase();
    const compact = normalized.replace(/[\s_-]/g, "");

    const match = Object.entries(DocumentEnum).find(([key, item]) => {
      const keyCompact = key.toLowerCase().replace(/[\s_-]/g, "");
      const labelCompact = item.label.toLowerCase().replace(/[\s_-]/g, "");
      return (
        key.toLowerCase() === normalized ||
        item.label.toLowerCase() === normalized ||
        keyCompact === compact ||
        labelCompact === compact
      );
    });
    if (match) return match[1].label;
  }

  if (typeof documentType === "object") {
    return String((documentType as { label?: string }).label ?? "");
  }
  return String(documentType);
}
