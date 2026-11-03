import type { KardexMovementsRequest } from "@app/modules/Inventory/domain/api-contract/requests/kardex-movements.request";

export interface useKardexMovementsProps {
    payloadGetKardexMovementsRequest?: KardexMovementsRequest;
}