export interface BranchInformation {
   branch_id: string;
   branch_code?: string | null;
   branch_name?: string | null;
   company_alias?: string | null;
}

export interface InventoryEntryData {
   inventory_entry_id: string;
   code?: string | null;
   entry_status: number | string;
   branch_information?: BranchInformation | null;
}