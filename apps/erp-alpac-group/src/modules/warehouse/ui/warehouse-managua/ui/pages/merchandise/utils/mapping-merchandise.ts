export function resolveDocumentNumberFilters(
  documentNumber: string,
  documentType: string,
): { ducat_number: string; customs_declaration_number: string } {
  const number = documentNumber.trim();
  if (!number) {
    return { ducat_number: "", customs_declaration_number: "" };
  }

  if (documentType === "DUCA") {
    return { ducat_number: number, customs_declaration_number: "" };
  }

  if (documentType === "CustomsDeclaration") {
    return { ducat_number: "", customs_declaration_number: number };
  }

  return { ducat_number: number, customs_declaration_number: number };
}
