import type { DeductionDto } from "@app/modules/payroll/domain/ApiContract/Responses/deduction-responses/get-deductions.response";

export type ActiveDeductionTableProps = {
    data: DeductionDto[];
    pagination?: React.ReactNode;
    onViewDetail: (deduction: DeductionDto) => void;
}