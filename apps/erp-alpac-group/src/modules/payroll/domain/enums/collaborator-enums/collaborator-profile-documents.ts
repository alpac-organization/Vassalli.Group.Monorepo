import type { GeneratedDocumentType } from "@app/modules/payroll/domain/ApiContract/Requests/collaborator-requests/generated-document.request";

export type CollaboratorProfileDocumentConfig = {
  value: GeneratedDocumentType;
  label: string;
};

export const CollaboratorProfileDocumentEnum: Record<
  GeneratedDocumentType,
  CollaboratorProfileDocumentConfig
> = {
  LetterCollaboratorActive: {
    value: "LetterCollaboratorActive",
    label: "Colaborador Activo",
  },
  SalaryLetter: { value: "SalaryLetter", label: "Certificado Salarial" },
};
