import type { RecordEntranceStatusKey } from "@app/modules/warehouse/domain/ApiContract/Responses/warehouse-reponses/warehouse-managua/access-control/get-access-control";
import type { DucaStatusType } from "@app/modules/warehouse/domain/enums/warehouse-managua/duca-satus";

export interface GetMerchandiseDetailResponse {
  id: string;
  status: RecordEntranceStatusKey;
  reception: MerchandiseReceptionDetailDto;
  merchandiseRegistration: MerchandiseRegistrationLog;
  ducaRegistry: MerchandiseDucaRegistryDetail | null;
  customsDeclaration: MerchandiseCustomsDeclarationDetail | null;
}

interface MerchandiseReceptionDetailDto {
  countryOfOrigin: string;
  aduana: string;
  plateNumber: string;
  trailerChassis: string;
  driverLicense: string;
  transportista: string;
  transportUnitId: string;
  transportUnitName: string | null;
  driverName: string;
  sealNumber: string;
  documentType: DocumentType;
  transportUnitExitDate: string | null;
  transportUnitExitTime: string | null;
  containerNumber: string | null;
}
interface MerchandiseRegistrationLog {
  merchandiseRegistrationEndDate: string | null;
  merchandiseRegistrationEndTime: string | null;
  merchandiseFinishedByUserName: string | null;
  durationTotalSeconds: number | null;
  durationFormatted: string | null;
  merchandiseRegistrationDate: string | null;
  merchandiseRegistrationTime: string | null;
  merchandiseRegisteredByUserName: string | null;
}

interface MerchandiseDucaRegistryDetail {
  empresa: string | null;
  generalObservations: string | null;
  isInTransit: boolean | null;

  registeredByUserName: string | null;
  registeredStartDate: string | null;
  registeredEndDate: string | null;
  registeredStartTime: string | null;
  registeredEndTime: string | null;

  updatedByUserName: string | null;
  updatedDate: string | null;
  updatedTime: string | null;

  durationInSeconds: number | null;
  durationFormatted: string | null;
  ducats: MerchandiseDucatDetailDto[] | null;
}
interface MerchandiseDucatDetailDto {
  id: string;
  ducatNumber: string;
  status: DucaStatusType;

  productId: string | null;
  productName: string | null;
  totalBultos: number | null;
  totalWeight: number | null;
  productDescription: string | null;
  remitente: string | null;
  destinationAreaObservation: string | null;

  registeredByUserName: string | null;
  registeredStartDate: string | null;
  registeredEndDate: string | null;
  registeredStartTime: string | null;
  registeredEndTime: string | null;
  durationInSeconds: number | null;
  durationFormatted: string | null;

  updatedByUserName: string | null;
  updatedDate: string | null;
  updatedTime: string | null;
}
interface MerchandiseCustomsDeclarationDetail {
  customsDeclarationNumber: string;
  packages: number | null;
  customer: string | null;
  product: string | null;
}
