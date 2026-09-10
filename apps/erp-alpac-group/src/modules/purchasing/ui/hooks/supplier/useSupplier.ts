import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/create-supplier-response";
import type {
	CreateSupplierBankAccountPayload,
	SupplierBankAccount,
	UpdateSupplierBankAccountPayload,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const suppliersServices = new SupplierServices(httpHandler);

type useSuppliersProps = {
	suppliersFilters?: GetSuppliersRequest;
	supplierDetailFilters?: GetSupplierDetailsRequest;
};

export type CreateBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	payload: CreateSupplierBankAccountPayload;
};

export type UpdateBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	bankAccountId: string;
	payload: UpdateSupplierBankAccountPayload;
};

export type DeleteBankAccountMutationArgs = {
	companyId: string;
	moduleCode: string;
	supplierId: string;
	bankAccountId: string;
};

export const useSupplier = (props?: useSuppliersProps) => {
	const queryClient = useQueryClient();

	const { suppliersFilters, supplierDetailFilters } = props || {};

	const suppliersListEnabled = Boolean(
		suppliersFilters?.company_id?.trim() &&
		suppliersFilters.module_code?.trim() &&
		suppliersFilters?.page_number
	);

	const supplierDetailsEnabled = Boolean(
		supplierDetailFilters?.company_id?.trim() &&
		supplierDetailFilters.module_code?.trim() &&
		supplierDetailFilters?.supplier_id
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

	const GetSupplierDetails = useQuery({
		queryKey: ["supplier-details", supplierDetailFilters],
		queryFn: () => suppliersServices.GetSupplierDetails(supplierDetailFilters!),
		enabled: supplierDetailsEnabled,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const CreateSupplier = useMutation<CreateSupplierResponse, ApiErrorResponse, CreateSupplierRequest>({
		mutationKey: ["create-supplier"],
		mutationFn: (payload: CreateSupplierRequest) => suppliersServices.CreateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
		retry: 1,
	});

	const UpdateSupplier = useMutation<void, ApiErrorResponse, UpdateSupplierRequest>({
		mutationKey: ["update-supplier"],
		mutationFn: (payload: UpdateSupplierRequest) => suppliersServices.UpdateSupplier(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		},
	});

	const CreateBankAccount = useMutation<SupplierBankAccount, ApiErrorResponse, CreateBankAccountMutationArgs>({
		mutationKey: ["create-supplier-bank-account"],
		mutationFn: ({ companyId, moduleCode, supplierId, payload }) =>
			suppliersServices.createBankAccount(companyId, moduleCode, supplierId, payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
		},
	});

	const UpdateBankAccount = useMutation<void, ApiErrorResponse, UpdateBankAccountMutationArgs>({
		mutationKey: ["update-supplier-bank-account"],
		mutationFn: ({ companyId, moduleCode, supplierId, bankAccountId, payload }) =>
			suppliersServices.updateBankAccount(companyId, moduleCode, supplierId, bankAccountId, payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
		},
	});

	const DeleteBankAccount = useMutation<void, ApiErrorResponse, DeleteBankAccountMutationArgs>({
		mutationKey: ["delete-supplier-bank-account"],
		mutationFn: ({ companyId, moduleCode, supplierId, bankAccountId }) =>
			suppliersServices.deleteBankAccount(companyId, moduleCode, supplierId, bankAccountId),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
		},
	});

	return {
		GetSuppliers,
		GetSupplierDetails,
		CreateSupplier,
		UpdateSupplier,
		CreateBankAccount,
		UpdateBankAccount,
		DeleteBankAccount,
	};
};
