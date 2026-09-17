export interface SelectCostCenterProps
{
    readonly areaId: string;
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly onSelect: (costCenterId: string) => void;
}