import { DataTableProps } from "./datatable.type"

export function DataTable<T>({ title, data, columns, rowClassName, pagination }: DataTableProps<T>): React.ReactElement {
   return (
      <div className="w-full 
            rounded-lg 
            overflow-hidden 
            border 
            border-slate-600 
            hover:border-neutral-600 
            bg-white 
            dark:bg-[#272b34]">

         {
            title && (
               <div className="flex justify-between items-center p-6 border-b-2 border-slate-600 dark:border-neutral-600">
                  <h2 className="
                            p-0!
                            m-0!
                            flex! 
                            items-center! 
                            space-x-2! 
                            rtl:space-x-reverse! 
                            text-lg! 
                            font-semibold! 
                            text-gray-500! 
                            dark:text-gray-300!">
                     <span>{title}</span>
                  </h2>
                  {
                     pagination !== undefined && pagination
                  }
               </div>
            )
         }

         {
            data !== undefined && data.length ? (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead className="border-b-2 border-slate-600 dark:border-neutral-600">

                        <tr className="dark:bg-[#272b34] ">
                           {
                              columns.map((column) => (
                                 <th key={column.key as string} className="px-6 py-4 text-xs font-bold uppercase text-neutral-900 dark:text-white">{column.label}</th>
                              ))
                           }
                        </tr>

                     </thead>
                     <tbody className="divide-y divide-slate-600 dark:divide-neutral-600">

                        {
                           data.map((item, index) => {
                              return (
                                 <tr key={index} className={rowClassName !== undefined ? rowClassName : "hover:bg-neutral-50/80 dark:hover:bg-[#363a45]"}>
                                    {columns.map((column) => (
                                       <td key={column.key as string} className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                                          {
                                             column.render ? column.render(item) : (item as any)[column.key]
                                          }
                                       </td>
                                    ))}
                                 </tr>
                              )
                           })
                        }
                     </tbody>
                  </table>
               </div>
            ) :
               <div className="py-5 flex justify-center">
                  <small className="text-gray-500 dark:text-gray-300">No hay registros existentes</small>
               </div>
         }
      </div >
   )
}