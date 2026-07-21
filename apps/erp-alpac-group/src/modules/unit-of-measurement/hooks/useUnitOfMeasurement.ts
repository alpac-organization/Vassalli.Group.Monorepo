import { useQuery } from "@tanstack/react-query";
import type { GetUnitMeasurementRequest } from "@app/modules/unit-of-measurement/domain/requests/get-unit-measurement";
import { UnitMeasurementServices } from "@app/modules/unit-of-measurement/Infrastructure/services/UnitMeasurementServices";
import { httpHandler } from "@app/core/adapters/axiosAdapter";
type useUnitOfMeasurementProps = {
  payloadUnitOfMeasurement: GetUnitMeasurementRequest;
  enabled?: boolean;
};
const unitMeasurementServices = new UnitMeasurementServices(httpHandler);
export const useUnitOfMeasurement = (props: useUnitOfMeasurementProps) => {
  const { payloadUnitOfMeasurement, enabled = true } = props;
  const GetUnitMeasurements = useQuery({
    queryKey: [
      "unit-measurements",
      payloadUnitOfMeasurement.companie_id,
      payloadUnitOfMeasurement.module_code,
    ],
    queryFn: () =>
      unitMeasurementServices.getUnitMeasurements(payloadUnitOfMeasurement),
    enabled:
      enabled &&
      Boolean(
        payloadUnitOfMeasurement.companie_id &&
        payloadUnitOfMeasurement.module_code,
      ),
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
  return { GetUnitMeasurements };
};
