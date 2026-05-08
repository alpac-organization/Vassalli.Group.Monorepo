export interface CreateSubsidyRequest {
   company_id: string;
   module_code: string;
   collaborator_id: string;
   subsidy_type: string;
   start_date: string | null;
   end_date: string | null;
   boleta_number: string;
   observations: string;
}