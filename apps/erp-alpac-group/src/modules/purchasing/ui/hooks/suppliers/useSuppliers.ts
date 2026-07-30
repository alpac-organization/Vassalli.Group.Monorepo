import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/suppliers/requests/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/suppliers/requests/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/suppliers/responses/create-supplier-response";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/suppliers/SupplierServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const suppliersServices = new SupplierServices(httpHandler);

type useSuppliersProps = {
	suppliersFilters?: GetSuppliersRequest;
};

export const useSuppliers = (props?: useSuppliersProps) => {

	const queryClient = useQueryClient();

	const { suppliersFilters } = props || {};

	const suppliersListEnabled = Boolean(
		suppliersFilters?.companie_id?.trim() &&
		suppliersFilters.module_code?.trim() && 
		suppliersFilters?.page_number
	);

	const GetSuppliers = useQuery({
		queryKey: ["suppliers", suppliersFilters],
		queryFn: () => suppliersServices.getSuppliers(suppliersFilters!),
		staleTime: 1000 * 60 * 2,
		enabled: suppliersListEnabled,
		retry: 1,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	const CreateSupplier = useMutation<CreateSupplierResponse, ApiErrorResponse, CreateSupplierRequest>({
		mutationKey: ["create-supplier"],
		mutationFn: (payload: CreateSupplierRequest) => suppliersServices.CreateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
		retry: 1
	});

	const UpdateSupplier = useMutation<void, ApiErrorResponse, UpdateSupplierRequest>({
		mutationKey: ["update-supplier"],
		mutationFn: (payload: UpdateSupplierRequest) => suppliersServices.UpdateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		}
	});

	return { GetSuppliers, CreateSupplier, UpdateSupplier };
};
