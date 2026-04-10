import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { PaginationProps } from "./pagination.type";

export const Pagination = ({
   currentPage = 1,
   pageSize = 10,
   totalRecords = 10,
   onPageChange,
   disabled = false,
}: PaginationProps): React.ReactNode => {
   const totalPages = pageSize > 0 ? Math.ceil(totalRecords / pageSize) : 0
   return (
      <div className="flex items-center justify-center">
         <div className="flex items-center bg-white dark:bg-[#272b34]">

            <button
               title="Primera página"
               onClick={() => !disabled && currentPage > 1 && onPageChange(1)}
               disabled={disabled || currentPage === 1}
               className="p-2 m-1 hover:bg-neutral-100 dark:hover:bg-[#363a45] rounded-lg transition-all text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
               <ChevronsLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>


            <button
               title="Anterior"
               onClick={() => !disabled && currentPage > 1 && onPageChange(currentPage - 1)}
               disabled={disabled || currentPage === 1}
               className="p-2 m-1 hover:bg-neutral-100 dark:hover:bg-[#363a45] rounded-lg transition-all text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
               <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>


            <div className="px-5 py-1 flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-x border-slate-200 dark:border-neutral-700 mx-2">
               <span className="hidden sm:inline">Página</span>
               <div className="flex items-center justify-center bg-neutral-100 dark:bg-[#1e222a] px-3 py-1 rounded-md border border-slate-200 dark:border-neutral-600 min-w-[40px]">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{currentPage}</span>
               </div>
               <span>de</span>
               <span className="font-semibold">{totalPages}</span>
            </div>


            <button
               title="Siguiente"
               onClick={() => !disabled && currentPage < totalPages && onPageChange(currentPage + 1)}
               disabled={disabled || currentPage === totalPages}
               className="p-2 m-1 hover:bg-neutral-100 dark:hover:bg-[#363a45] rounded-lg transition-all text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
               <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>


            <button
               title="Última página"
               onClick={() => !disabled && currentPage < totalPages && onPageChange(totalPages)}
               disabled={disabled || currentPage === totalPages}
               className="p-2 m-1 hover:bg-neutral-100 dark:hover:bg-[#363a45] rounded-lg transition-all text-gray-600 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
               <ChevronsRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
         </div>
      </div>
   )
}

