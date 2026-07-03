export interface GetSubsidyHistoryResponse {
   collaborator_code?: string;
   collaborator_full_name?: string;
   amount_days: number;
   reference_number?: string;
   type_subsidy_name?: string;
   start_date: string;
   end_date: string;
   percentage: number;
   company_assumed_amount: number;
   inss_reimbursement_amount: number;
}
