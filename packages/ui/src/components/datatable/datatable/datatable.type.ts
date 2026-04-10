export type TableColumn<T> = {
   key: keyof T | string
   label: string
   render?: (item: T) => React.ReactNode
}

export type DataTableProps<T> = {
   title?: string
   data: T[]
   columns: TableColumn<T>[]
   rowClassName?: string
   pagination?: React.ReactNode
}