import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";

export interface QuoteDetailAccordionProps {
   quoteDetailIndex: number;
   accordionValue: string;
   supplier?: GetSuppliersResponse;
   isLoadingSuppliers?: boolean;
   onRemove: () => void;
}
