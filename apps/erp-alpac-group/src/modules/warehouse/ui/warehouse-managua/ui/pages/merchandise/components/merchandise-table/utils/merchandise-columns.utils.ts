import { DocumentEnum } from "@app/core/enums/document.enum";

const DUCA_BADGE_CLASS =
  "bg-[#123C69]! text-[#D6ECFF]! border border-[#2F6FB2]!";

const CUSTOMS_DECLARATION_BADGE_CLASS =
  "bg-[#234A2F]! text-[#D9FBE2]! border border-[#4FA56A]!";

const FALLBACK_DOCUMENT_TYPE_BADGE_CLASS =
  "bg-slate-100 text-slate-900 border border-slate-200 dark:bg-slate-600/60 dark:text-slate-200 dark:border-slate-500";

function resolveDocumentTypeKey(documentType: unknown): string {
  if (documentType == null) return "";

  if (typeof documentType === "string") {
    return documentType.trim();
  }

  if (typeof documentType === "object") {
    const asRecord = documentType as {
      value?: number | string;
      label?: string;
    };

    if (asRecord.value != null) {
      const matchByValue = Object.entries(DocumentEnum).find(
        ([, item]) => Number(item.value) === Number(asRecord.value),
      );
      if (matchByValue) return matchByValue[0];
    }

    if (asRecord.label) {
      const matchByLabel = Object.entries(DocumentEnum).find(
        ([, item]) =>
          item.label.toLowerCase() === asRecord.label!.toLowerCase(),
      );
      if (matchByLabel) return matchByLabel[0];
    }
  }

  return String(documentType);
}

export function getDocumentTypeBadgeClass(documentType: unknown): string {
  const key = resolveDocumentTypeKey(documentType).toLowerCase();

  if (key === "duca" || key === DocumentEnum.DUCA.label.toLowerCase()) {
    return DUCA_BADGE_CLASS;
  }

  if (
    key === "customsdeclaration" ||
    key === DocumentEnum.CustomsDeclaration.label.toLowerCase()
  ) {
    return CUSTOMS_DECLARATION_BADGE_CLASS;
  }

  return FALLBACK_DOCUMENT_TYPE_BADGE_CLASS;
}
