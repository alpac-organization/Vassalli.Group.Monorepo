import type { EnumType } from "@app/shared/types/enum.type";

export const HumanResourceDocuments = {
	LetterCollaboratorActive: { value: 1, label: "Constancia de Colaborador Activo" },
	SalaryLetter: { value: 2, label: "Constancia de Salario" },
} as const satisfies Record<string, EnumType>;

export const TransportDocuments = {
	DUCA: { value: 3, label: "Duca" },
	CustomsDeclaration: { value: 4, label: "Decl. Aduanera" },
} as const satisfies Record<string, EnumType>;

export const DocumentEnum: Record<string, EnumType> = {
	...HumanResourceDocuments,
	...TransportDocuments,
} as const;

export type DocumentType = (typeof DocumentEnum)[keyof typeof DocumentEnum];

export type HumanResourceDocumentType = keyof typeof HumanResourceDocuments;

export type TransportDocumentType = keyof typeof TransportDocuments;

export const DocumentTypeOptions: EnumType[] = Object.values(DocumentEnum);

export const HumanResourceDocumentTypeOptions: EnumType[] = Object.values(
	HumanResourceDocuments,
);

export const TransportDocumentTypeOptions: EnumType[] =
	Object.values(TransportDocuments);