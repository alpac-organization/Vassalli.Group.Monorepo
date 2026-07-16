import { httpHandler } from "@app/core/adapters";
import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-suppliers";
import { SuppliersServices } from "@app/modules/procurement/Infrastructure/services/suppliers/SuppliersServices";
import { useQuery } from "@tanstack/react-query";
const suppliersServices = new SuppliersServices(httpHandler);
type useSuppliersProps = {
  suppliersFilters?: GetSuppliersRequest;
};
export const useSuppliers = (props: useSuppliersProps) => {
  const { suppliersFilters } = props;
  const suppliersListEnabled = Boolean(
    suppliersFilters?.companie_id?.trim() &&
    suppliersFilters.module_code?.trim(),
  );
  const GetSuppliers = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => suppliersServices.getSuppliers(suppliersFilters!),
    staleTime: 1000 * 60 * 2,
    enabled: suppliersListEnabled,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return { GetSuppliers };
};
