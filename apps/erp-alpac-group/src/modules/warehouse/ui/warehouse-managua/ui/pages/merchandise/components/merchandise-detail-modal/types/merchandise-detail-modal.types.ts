import type { GetMerchandiseDetailResponse } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/merchandise/get-merchandise-detail";

export type MerchandiseDetailModalProps = {
  isOpen: boolean;
  detail: GetMerchandiseDetailResponse | null | undefined;
  isLoading?: boolean;
  onClose: () => void;
};

export type MerchandiseDetailDisplayValues = {
  documentType: string;
  countryOfOrigin: string;
  registrationDate: string;
  registrationTime: string;
  registrationEndTime: string;
  durationFormatted: string;
  registeredByUserName: string;
  finishedByUserName: string;
  plateNumber: string;
  trailerChassis: string;
  driverName: string;
  driverLicense: string;
  transportista: string;
  transportUnitName: string;
  sealNumber: string;
  aduana: string;
  containerNumber: string;
  transportUnitExitDate: string;
  transportUnitExitTime: string;
  customsDeclarationNumber: string;
  packages: string;
  customer: string;
  product: string;
  serviceOrderCode: string;
  ducaEmpresa: string;
  ducaObservations: string;
  ducaRegisteredBy: string;
  ducaRegisteredStartDate: string;
  ducaRegisteredStartTime: string;
  ducaRegisteredEndTime: string;
  ducaDuration: string;
  ducaUpdatedBy: string;
  ducaUpdatedDate: string;
  ducaUpdatedTime: string;
};

export type DucatDisplayValues = {
  ducatNumber: string;
  merchandiseName: string;
  totalBultos: string;
  totalWeight: string;
  productDescription: string;
  remitente: string;
  destinationAreaObservation: string;
  serviceOrderCode: string;
  registeredByUserName: string;
  registeredStartDate: string;
  registeredStartTime: string;
  registeredEndTime: string;
  durationFormatted: string;
  updatedByUserName: string;
  updatedDate: string;
  updatedTime: string;
};
