export type TableColumn = {
    key: string
    label: string
    render?: (item: any) => React.ReactNode
}

export type DataTableProps = {
    title?: string
    data: any[]
    columns: TableColumn[],
    pagination?: {
        currentPage: number
        totalRecords: number
        pageSize: number
        onPageChange: (page: number) => void
    }
}