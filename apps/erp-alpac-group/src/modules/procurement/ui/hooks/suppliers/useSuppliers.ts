import { httpHandler } from "@app/core/adapters";
import type { CreateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/procurement/domain/suppliers/requests/get-supplier-request";
import type { UpdateSupplierRequest } from "@app/modules/procurement/domain/suppliers/requests/update-suppliers-request";
import { SupplierServices } from "@app/modules/procurement/Infrastructure/services/suppliers/SupplierServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const suppliersServices = new SupplierServices(httpHandler);

type useSuppliersProps = {
	suppliersFilters?: GetSuppliersRequest;
};

export const useSuppliers = (props: useSuppliersProps) => {

	const queryClient = useQueryClient();

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

	const CreateSupplier = useMutation({
		mutationKey: ["create-supplier"],
		mutationFn: (payload: CreateSupplierRequest) => suppliersServices.CreateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
		retry: 1
	});

	const UpdateSupplier = useMutation({
		mutationKey: ["update-supplier"],
		mutationFn: (payload: UpdateSupplierRequest) => suppliersServices.UpdateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		}
	});

	return { GetSuppliers, CreateSupplier, UpdateSupplier };
};
