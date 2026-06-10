import { Badges, Button, DataTable, type TableColumn } from "@alpac/design-system";
import type { ActiveDeductionTableProps } from "./active-deduction-table.types";
import { statusBadgeColor } from "../../../permissions/components/permission-table/utils/statusBadgeColor";

export const ActiveDeductionTable = ({ data, pagination }: ActiveDeductionTableProps) => {

    const columns: TableColumn<any>[] = [
        { key: 'collaborator_code', label: 'Código de Colaborador' },
        { key: 'requested_by', label: 'Solicitado por' },
        {
            key: 'type',
            label: 'Tipo',
            render: (value) => `${value} testing`
        },
        {
            key: 'status',
            label: 'Estado',
            render: (value) => (
                <Badges
                    label={"-"}
                    color={statusBadgeColor(value.status)} />
            )
        },
        {
            key: 'actions',
            label: 'Acciones',
            render: (value) => (
                <Button
                    label="Ver Solicitud"
                    size="small"
                    className="text-[13px]! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
                    onClick={() => console.log("Testing", value)}
                />
            )
        },
    ]

    return (
        <DataTable
            title="Lista de deducciones activas"
            data={data}
            columns={columns}
            pagination={pagination}
        />
    );
}