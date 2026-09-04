export interface CreateWarehouseAssignmentRequest {
  company_id: string;
  module_code: string;
  reception_id: string;
  entrance_ducat_id: string | null; // null cuando DocumentType === CustomsDeclaration
  warehouse_id: string;
  warehouse_chief_user_id: string;
}

