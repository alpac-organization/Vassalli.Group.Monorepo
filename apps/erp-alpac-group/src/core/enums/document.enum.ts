import type { EnumType } from "@app/shared/types/enum.type";
const HumanResourceDocuments: Record<string, EnumType> = {
  LetterCollaboratorActive: {
    value: 1,
    label: "Constancia de Colaborador Activo",
  },
  SalaryLetter: { value: 2, label: "Constancia de Salario" },
};

const TransportDocuments: Record<string, EnumType> = {
  DUCA: { value: 3, label: "Duca" },
  CustomsDeclaration: { value: 4, label: "D. Aduanera" },
};

export const DocumentEnum: Record<string, EnumType> = {
  ...HumanResourceDocuments,
  ...TransportDocuments,
} as const;
export type DocumentType = (typeof DocumentEnum)[keyof typeof DocumentEnum];

export type HumanResourceDocumentType =
  (typeof HumanResourceDocuments)[keyof typeof HumanResourceDocuments];

export type TransportDocumentType =
  (typeof TransportDocuments)[keyof typeof TransportDocuments];

export const DocumentTypeOptions: EnumType[] = Object.values(DocumentEnum);

export const HumanResourceDocumentTypeOptions: EnumType[] = Object.values(
  HumanResourceDocuments,
);

export const TransportDocumentTypeOptions: EnumType[] =
  Object.values(TransportDocuments);
