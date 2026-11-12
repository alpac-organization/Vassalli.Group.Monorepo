import { httpHandler } from "@app/core/adapters";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-supplier-details-request";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { UpdateSupplierExclusiveStatusRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-supplier-exclusive-status.request";
import type { UpdateSupplierProductPriceRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-supplier-product-price.request";
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

const SUPPLIERS_STALE_TIME = 1000 * 60 * 2;

const isSuppliersListEnabled = (filters?: GetSuppliersRequest) =>
	Boolean(
		filters?.company_id?.trim() &&
			filters.module_code?.trim() &&
			filters.page_number,
	);

export const useSuppliersList = (filters: GetSuppliersRequest) =>
	useQuery({
		queryKey: ["suppliers", filters],
		queryFn: () => suppliersServices.getSuppliers(filters),
		staleTime: SUPPLIERS_STALE_TIME,
		enabled: isSuppliersListEnabled(filters),
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: 1,
	});


const isSupplierDetailsEnabled = (filters?: GetSupplierDetailsRequest) =>
	Boolean(
		filters?.company_id?.trim() &&
			filters.module_code?.trim() &&
			filters.supplier_id,
	);

export const supplierDetailsQueryOptions = (filters?: GetSupplierDetailsRequest) => ({
	queryKey: ["supplier-details", filters] as const,
	queryFn: () => suppliersServices.GetSupplierDetails(filters!),
	enabled: isSupplierDetailsEnabled(filters),
	refetchOnWindowFocus: false as const,
	retry: 1,
	staleTime: SUPPLIERS_STALE_TIME,
});

const createSupplierMutationOptions = (queryClient: QueryClient) => ({
	mutationKey: ["create-supplier"] as const,
	mutationFn: (payload: CreateSupplierRequest) =>
		suppliersServices.CreateSupplier(payload),
	onSuccess() {
		queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		queryClient.invalidateQueries({ queryKey: ["get-products"] });
		queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
	},
	retry: 1,
});

const updateSupplierMutationOptions = (queryClient: QueryClient) => ({
	mutationKey: ["update-supplier"] as const,
	mutationFn: (payload: UpdateSupplierRequest) =>
		suppliersServices.UpdateSupplier(payload),
	onSuccess() {
		queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		queryClient.invalidateQueries({ queryKey: ["get-products"] });
		queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
	},
});

const createBankAccountMutationOptions = (queryClient: QueryClient) => ({
	mutationKey: ["create-supplier-bank-account"] as const,
	mutationFn: ({
		companyId,
		moduleCode,
		supplierId,
		payload,
	}: CreateBankAccountMutationArgs) =>
		suppliersServices.createBankAccount(
			companyId,
			moduleCode,
			supplierId,
			payload,
		),
	onSuccess() {
		queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
	},
});

const updateBankAccountMutationOptions = (queryClient: QueryClient) => ({
	mutationKey: ["update-supplier-bank-account"] as const,
	mutationFn: ({
		companyId,
		moduleCode,
		supplierId,
		bankAccountId,
		payload,
	}: UpdateBankAccountMutationArgs) =>
		suppliersServices.updateBankAccount(
			companyId,
			moduleCode,
			supplierId,
			bankAccountId,
			payload,
		),
	onSuccess() {
		queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
	},
});

const deleteBankAccountMutationOptions = (queryClient: QueryClient) => ({
	mutationKey: ["delete-supplier-bank-account"] as const,
	mutationFn: ({
		companyId,
		moduleCode,
		supplierId,
		bankAccountId,
	}: DeleteBankAccountMutationArgs) =>
		suppliersServices.deleteBankAccount(
			companyId,
			moduleCode,
			supplierId,
			bankAccountId,
		),
	onSuccess() {
		queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		queryClient.invalidateQueries({ queryKey: ["supplier-bank-accounts"] });
	},
});

const useSupplierEditorMutations = () => {
	const queryClient = useQueryClient();

	const CreateSupplier = useMutation<
		CreateSupplierResponse,
		ApiErrorResponse,
		CreateSupplierRequest
	>(createSupplierMutationOptions(queryClient));

	const UpdateSupplier = useMutation<void, ApiErrorResponse, UpdateSupplierRequest>(
		updateSupplierMutationOptions(queryClient),
	);

	const CreateBankAccount = useMutation<
		SupplierBankAccount,
		ApiErrorResponse,
		CreateBankAccountMutationArgs
	>(createBankAccountMutationOptions(queryClient));

	const UpdateBankAccount = useMutation<
		void,
		ApiErrorResponse,
		UpdateBankAccountMutationArgs
	>(updateBankAccountMutationOptions(queryClient));

	const DeleteBankAccount = useMutation<
		void,
		ApiErrorResponse,
		DeleteBankAccountMutationArgs
	>(deleteBankAccountMutationOptions(queryClient));

	return {
		CreateSupplier,
		UpdateSupplier,
		CreateBankAccount,
		UpdateBankAccount,
		DeleteBankAccount,
	};
};

export const useSupplierEditor = (detailFilters?: GetSupplierDetailsRequest) => {
	const GetSupplierDetails = useQuery(supplierDetailsQueryOptions(detailFilters));
	const mutations = useSupplierEditorMutations();

	return {
		GetSupplierDetails,
		...mutations,
	};
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

	const UpdateSupplierExclusiveStatus = useMutation<
		void,
		ApiErrorResponse,
		UpdateSupplierExclusiveStatusRequest
	>({
		mutationKey: ["update-supplier-exclusive-status"],
		mutationFn: (payload) =>
			suppliersServices.UpdateSupplierExclusiveStatus(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
		},
		retry: 1,
	});

	const UpdateSupplierProductPrice = useMutation<
		void,
		ApiErrorResponse,
		UpdateSupplierProductPriceRequest
	>({
		mutationKey: ["update-supplier-product-price"],
		mutationFn: (payload) =>
			suppliersServices.UpdateSupplierProductPrice(payload),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ["supplier-details"] });
			queryClient.invalidateQueries({ queryKey: ["get-product-details"] });
			queryClient.invalidateQueries({
				queryKey: ["get-product-supplier-price-history"],
			});
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
			queryClient.invalidateQueries({ queryKey: ["get-products"] });
		},
		retry: 1,
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
		UpdateSupplierExclusiveStatus,
		UpdateSupplierProductPrice,
		CreateBankAccount,
		UpdateBankAccount,
		DeleteBankAccount,
	};
};
