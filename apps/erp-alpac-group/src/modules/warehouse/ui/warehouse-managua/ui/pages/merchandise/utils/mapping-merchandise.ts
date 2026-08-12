import {
  DocumentEnum,
  type TransportDocumentType,
} from "@app/core/enums/document.enum";

export function resolveTransportDocumentType(
  documentType: string,
): TransportDocumentType | "" {
  const key = documentType.trim();
  if (!key) return "";

  if (key === "DUCA") return DocumentEnum.DUCA;
  if (key === "CustomsDeclaration") return DocumentEnum.CustomsDeclaration;

  return "";
}
