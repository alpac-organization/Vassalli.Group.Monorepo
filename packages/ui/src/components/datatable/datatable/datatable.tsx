import React, { useState } from "react";
import { DataTableProps } from "./datatable.type";

const SELECTED_ROW_BORDER =
	"outline outline-2 outline-sky-600 dark:outline-sky-500 outline-offset-[-2px]";

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
	height,
	minHeight,
	maxHeight,
	enableSelectBorder = false,
	selectedRowKey = null,
	getRowKey,
}: DataTableProps<T>): React.ReactElement {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const handleRowClick = (item: T, index: number) => {
		setSelectedIndex(index);
		onRowClick?.(item);
	};

	const handleRowDoubleClick = (item: T, index: number) => {
		setSelectedIndex(index);
		onRowDoubleClick?.(item);
	};

	const isRowSelected = (item: T, index: number) => {
		if (selectedRowKey != null && getRowKey) {
			return getRowKey(item) === selectedRowKey;
		}
		return selectedIndex === index;
	};

	return (
		<div
			className="flex h-full min-h-0 w-full flex-col
      				rounded-lg border border-slate-600
      				hover:border-neutral-600 bg-white dark:bg-[#272b34]">
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
				<div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto"
					style={{
						...(height !== undefined ? { height } : {}),
						...(minHeight !== undefined ? { minHeight } : {}),
						...(maxHeight !== undefined ? { maxHeight } : {}),
					}}>
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
								const isSelected = isRowSelected(item, index);
								const baseRowClass =
									rowClassName !== undefined
										? rowClassName
										: `hover:bg-neutral-50/80 dark:hover:bg-[#363a45] ${onRowClick !== undefined ||
											onRowDoubleClick !== undefined
											? "cursor-pointer"
											: ""
										}`;

								return (
									<tr
										key={getRowKey ? getRowKey(item) : index}
										className={`${baseRowClass} ${isSelected && enableSelectBorder ? SELECTED_ROW_BORDER : ""}`}
										onClick={() => handleRowClick(item, index)}
										onDoubleClick={() => handleRowDoubleClick(item, index)}
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
													className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-900 rounded-md focus:outline-none focus:ring-2
                          									focus:ring-offset-2 dark:focus:ring-offset-[#272b34] transition-colors"
												>
													{deleteIcon && <span>{deleteIcon}</span>}

													{deleteText && <span>{deleteText}</span>}
													{!deleteText && !deleteIcon && (
														<span>Eliminar</span>
													)}
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
