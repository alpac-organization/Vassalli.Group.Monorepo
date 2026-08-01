import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const suppliersServices = new SupplierServices(httpHandler);

type useSuppliersProps = {
	suppliersFilters?: GetSuppliersRequest;
};

export const useSupplier = (props?: useSuppliersProps) => {

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
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
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
