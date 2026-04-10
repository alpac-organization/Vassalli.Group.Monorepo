export type PaginationProps = {
   currentPage: number;
   totalRecords: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   disabled?: boolean;
}
