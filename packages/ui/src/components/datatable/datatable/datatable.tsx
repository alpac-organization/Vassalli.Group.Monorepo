import React from "react";
import { DataTableProps } from "./datatable.type";

export function DataTable<T>({
  title,
  data,
  columns,
  rowClassName,
  onRowClick,
  onRowDoubleClick,
  pagination,
  toolbarEnd,
  onDelete,
  deleteIcon,
  deleteText,
  isLoading = false,
  loadingTitle = "Cargando datos...",
}: DataTableProps<T>): React.ReactElement {
  const defaultRowClassName =
    "transition-colors hover:bg-neutral-50/80 dark:hover:bg-[#363a45]";

  return (
    <div
      className="relative w-full 
            rounded-lg 
            overflow-visible 
            border 
            border-slate-600 
            hover:border-neutral-600 
            bg-white 
            dark:bg-[#272b34]"
    >
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-[#1a1f2b]/60 backdrop-blur-[1px]"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="loader" />
          <p className="animate-pulse text-sm font-medium tracking-wide text-gray-300">
            {loadingTitle}
          </p>
        </div>
      )}
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-b-2 border-slate-600 dark:border-neutral-600">
          <h2
            className="
                            p-0!
                            m-0!
                            flex! 
                            min-w-0
                            flex-1
                            items-center! 
                            space-x-2! 
                            rtl:space-x-reverse! 
                            text-lg! 
                            font-semibold! 
                            text-gray-500! 
                            dark:text-gray-300!"
          >
            <span>{title}</span>
          </h2>
          {(pagination !== undefined || toolbarEnd !== undefined) && (
            <div className="hidden shrink-0 items-center gap-2 md:flex md:flex-wrap md:justify-end">
              {toolbarEnd}
              {pagination}
            </div>
          )}
        </div>
      )}

      {data !== undefined && data.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="border-b-2 border-slate-600 dark:border-neutral-600">
              <tr className="dark:bg-[#272b34]">
                {columns.map((column) => (
                  <th
                    key={column.key as string}
                    className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase text-neutral-900 dark:text-white"
                  >
                    {column.label}
                  </th>
                ))}

                {onDelete !== undefined && (
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase text-neutral-900 dark:text-white text-right">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600 dark:divide-neutral-600">
              {data.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={
                      rowClassName !== undefined
                        ? rowClassName
                        : `${defaultRowClassName} ${
                            onRowClick !== undefined ||
                            onRowDoubleClick !== undefined
                              ? "cursor-pointer"
                              : ""
                          }`
                    }
                    onClick={
                      onRowClick !== undefined
                        ? () => onRowClick(item)
                        : undefined
                    }
                    onDoubleClick={
                      onRowDoubleClick !== undefined
                        ? () => onRowDoubleClick(item)
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key as string}
                        className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-white"
                      >
                        {column.render
                          ? column.render(item)
                          : (item !== undefined
                              ? (item as any)[column.key]
                              : "—") || "—"}
                      </td>
                    ))}

                    {onDelete !== undefined && (
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#272b34] transition-colors"
                        >
                          {deleteIcon && <span>{deleteIcon}</span>}

                          {deleteText && <span>{deleteText}</span>}
                          {!deleteText && !deleteIcon && <span>Eliminar</span>}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-5 flex justify-center">
          <small className="text-gray-500 dark:text-gray-300">
            No hay registros existentes
          </small>
        </div>
      )}

      {(pagination !== undefined || toolbarEnd !== undefined) && (
        <div className="md:hidden w-full border-t-2 border-slate-600 px-6 py-4 dark:border-neutral-600">
          <div className="flex w-full flex-col gap-3">
            {toolbarEnd !== undefined && (
              <div className="flex w-full justify-center">{toolbarEnd}</div>
            )}
            {pagination !== undefined && (
              <div className="w-full overflow-x-auto">{pagination}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
