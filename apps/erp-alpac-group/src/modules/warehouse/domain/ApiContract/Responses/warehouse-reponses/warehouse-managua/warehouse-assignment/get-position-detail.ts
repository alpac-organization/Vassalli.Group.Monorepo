export interface ReceptionEntranceInformationDto {
  receptionEntranceId?: string | null;
  reception_entrance_id?: string | null;
  receptionCode?: string | null;
  reception_code?: string | null;
  vehiclePlateNumber?: string | null;
  vehicle_plate_number?: string | null;
  containerNumber?: string | null;
  container_number?: string | null;
  countryOfOrigin?: string | null;
  country_of_origin?: string | null;
  sealNumber?: string | null;
  seal_number?: string | null;
  documentType?: number | string | null;
  document_type?: number | string | null;
  vehicleExitTime?: string | null;
  vehicle_exit_time?: string | null;
  containerExitTime?: string | null;
  container_exit_time?: string | null;
  createdAt?: string | null;
  created_at?: string | null;
  additionalData?: unknown;
  additional_data?: unknown;
  customBranchesInformation?: unknown;
  custom_branches_information?: unknown;
  receptionTransportEntranceInformation?: unknown;
  reception_transport_entrance_information?: unknown;
}

export interface CustomerInformationDto {
  customerId?: string | null;
  customer_id?: string | null;
  fullName?: string | null;
  full_name?: string | null;
  phone?: string | null;
  identification?: string | null;
  email?: string | null;
}

export interface CostCenterInformationDto {
  costCenterId?: string | null;
  cost_center_id?: string | null;
  code?: string | null;
  name?: string | null;
}

export interface OperationalOrderDetailsDto {
  operationOrderId?: string | null;
  operation_order_id?: string | null;
  poCode?: string | null;
  po_code?: string | null;
  documentNumber?: string | null;
  document_number?: string | null;
  documentType?: number | string | null;
  document_type?: number | string | null;
  status?: number | string | null;
  isAlerted?: boolean | null;
  is_alerted?: boolean | null;
  isConsolidated?: boolean | null;
  is_consolidated?: boolean | null;
  shippingCompany?: string | null;
  shipping_company?: string | null;
  consignee?: string | null;
  sender?: string | null;
  weight?: number | null;
  packagesCount?: number | null;
  packages_count?: number | null;
  description?: string | null;
  policyNumber?: string | null;
  policy_number?: string | null;
  customerInformation?: CustomerInformationDto | null;
  customer_information?: CustomerInformationDto | null;
  costCenterInformation?: CostCenterInformationDto | null;
  cost_center_information?: CostCenterInformationDto | null;
  receptionEntranceInformation?: ReceptionEntranceInformationDto | null;
  reception_entrance_information?: ReceptionEntranceInformationDto | null;
}

export interface PalletPositioningDto {
  countPallets?: number;
  count_pallets?: number;
  type?: number;
  width?: number;
  length?: number;
  bulksPerPallet?: number | null;
  bulks_per_pallet?: number | null;
}

export interface AssignmentMerchandiseInformationDto {
  merchandise?: string | null;
  merchandiseDescription?: string | null;
  merchandise_description?: string | null;
  hasMerchandiseDescription?: boolean | null;
  has_merchandise_description?: boolean | null;
  category?: unknown;
  merchandiseType?: number | string | null;
  merchandise_type?: number | string | null;
  destinationType?: number | string | null;
  destination_type?: number | string | null;
  observations?: string | null;
  hasPositionatingInformation?: boolean | null;
  has_positionating_information?: boolean | null;
  pallets?: PalletPositioningDto[];
}

export interface RemainingPositionDto {
  sectionInformation?: {
    sectionId?: string;
    section_id?: string;
    code?: string;
  } | null;
  section_information?: unknown;
  lotPositionInformation?: {
    positionCode?: string;
    position_code?: string;
    row?: number;
    column?: number;
    level?: number;
    status?: number;
  } | null;
  lot_position_information?: unknown;
  rackPositionInformation?: {
    positionCode?: string;
    position_code?: string;
    level?: number;
    status?: number;
  } | null;
  rack_position_information?: unknown;
}

export interface PositionDetailResponse {
  operationalOrderDetail?: OperationalOrderDetailsDto | null;
  operational_order_detail?: OperationalOrderDetailsDto | null;
  remainingPositions?: RemainingPositionDto[];
  remaining_positions?: RemainingPositionDto[];
  codeQr?: string | null;
  code_qr?: string | null;
  codeBar?: string | null;
  code_bar?: string | null;
  qrCode?: string | null;
  qr_code?: string | null;
  barCode?: string | null;
  bar_code?: string | null;
  merchandiseInformation?: AssignmentMerchandiseInformationDto | null;
  merchandise_information?: AssignmentMerchandiseInformationDto | null;
}

