import type { WAREHOUSE_VISUAL_MOCK } from "../../../mock/receiving-mocked-data";

export type ReceivingProps = {
    warehouse: (typeof WAREHOUSE_VISUAL_MOCK)[number];
    isSelected: boolean;
    onSelect: () => void;
}

export type ReceivingStatus = "pending" | "located";

export type ReceivingRecord = {
    id: number;
    identification_number: string;
    driverName: string;
    licensePlate: string;
    trailerPlate: string;
    customer: string;
    exporter: string;
    product: string;
    presentation: string;
    lotOrZafra: string;
    netWeightKg: number;
    scaleTicket: string;
    weighedAt: string;
    status: ReceivingStatus;
    warehouse?: string;
};