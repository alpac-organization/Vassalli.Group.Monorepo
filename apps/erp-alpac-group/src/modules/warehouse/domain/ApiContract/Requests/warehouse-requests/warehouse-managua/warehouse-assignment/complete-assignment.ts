export interface CompleteAssignmentRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  entrance_ducat_id: string | null; // null cuando DocumentType === CustomsDeclaration
}

