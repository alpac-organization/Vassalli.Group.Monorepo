export interface GetCollaboratorProfileGeneratedDocumentParams {
  company_id: string;
  module_code: string;
  identification_number: string;
  document_type: GeneratedDocumentType;
}
export type GeneratedDocumentType = "LetterCollaboratorActive" | "SalaryLetter";
