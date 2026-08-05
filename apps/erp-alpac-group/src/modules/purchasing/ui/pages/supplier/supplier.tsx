import { useCallback, useState } from "react";
import {
	Alert,
	AnimatedAlertWrapper,
	Badges,
	Button,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Pagination,
	type TableColumn,
} from "@alpac/design-system";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { SupplierModal } from "./components/supplier-modal/supplier-modal";
import { ConstitutionEnum, ConstitutionOptions } from "@app/core/enums/constitution.enum";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useSupplier } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/get-suppliers-request";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import { Loader } from "@app/shared/components/loaders/loader";
import { Controller, useForm } from "react-hook-form";
import { formatIdentificationNumber, formatRuc } from "@app/shared/utils/string.utils";
import { PackagePlusIcon } from "lucide-react";
import { constitutionTypeBadgeVariants, idenitificationTypeBadgeVariants } from "./supplier.variants";
import { isValidateValue } from "@app/shared/utils/values.utils";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const contextMenuButton = "rounded-md! w-10! bg-transparent! border dark:border-slate-600! dark:hover:border-neutral-600!";
const PAGE_SIZE = 5;

export const Supplier = () => {

	const buildBaseFilters = (): GetSuppliersRequest => ({
		companie_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const { companyId, moduleCode } = useUserStore();

	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState<GetSuppliersResponse | null>(null)
	const [filters, setFilters] = useState<GetSuppliersRequest>(buildBaseFilters);

	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const defaultFilters: Pick<
		GetSuppliersRequest, "identification_number" | "constitution_type"
	> = {
		identification_number: "",
		constitution_type: undefined
	}

	const {
		register,
		handleSubmit,
		control,
		reset,
		watch
	} = useForm<GetSuppliersRequest>({
		defaultValues: { ...defaultFilters }
	});

	const { GetSuppliers } = useSupplier({
		suppliersFilters: {
			...filters,
			companie_id: companyId,
			module_code: moduleCode,
			page_size: PAGE_SIZE
		},
	});

	const suppliers = GetSuppliers.data?.data ?? [];
	const totalRecords = GetSuppliers.data?.total ?? 0;
	const currentPage = filters.page_number ?? 1;
	const constitutionType = watch("constitution_type");
	const isLegalPerson = constitutionType === ConstitutionEnum.Legal.value;
	const isNaturalPerson = constitutionType === ConstitutionEnum.Natural.value;

	const handleClearFilters = () => {
		reset(defaultFilters)
		setFilters(buildBaseFilters());
	};

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({
			...prev,
			page_number: page,
		}));
	}, []);

	const onEditSupplier = (data: GetSuppliersResponse) => {
		setSelectedSupplier(data);
		setIsSupplierModalOpen(true);
	}

	const onViewDetails = (data: GetSuppliersResponse) => {
	}

	const columnConfig: TableColumn<GetSuppliersResponse>[] = [
		{ key: "supplier_legal_name", label: "Razón social" },
		{
			key: "constitution_type",
			label: "Tipo de constitución",
			render(row: GetSuppliersResponse) {
				if (!isValidateValue(row.constitution_type)) {
					return "—";
				}

				const propValue = constitutionTypeBadgeVariants[
					row.constitution_type as keyof typeof constitutionTypeBadgeVariants
				] ?? constitutionTypeBadgeVariants.default;

				return <Badges label={propValue.label} color={propValue.badgeColor} />;
			},
		},
		{
			key: "identification_type",
			label: "Tipo de identificación",
			render(row: GetSuppliersResponse) {
				if (!isValidateValue(row.identification_type)) {
					return "—";
				}

				const propValue = idenitificationTypeBadgeVariants[
					row.identification_type as keyof typeof idenitificationTypeBadgeVariants
				] ?? idenitificationTypeBadgeVariants.default;

				return <Badges label={propValue.label} color={propValue.badgeColor} />
			}
		},
		{ key: "identification_number", label: "Número de identificación" },
		{
			key: "actions",
			label: "Acciones",
			render: (row: GetSuppliersResponse) => (
				<ContextMenu
					triggerClassName={contextMenuButton}
					items={[
						{ label: "Editar", onClick: () => onEditSupplier(row) },
						{ label: "Ver detalle", onClick: () => onViewDetails(row) },
					]}
				/>
			),
		},
	];

	const handleFilterSuppliers = (data: GetSuppliersRequest) => {

		const identification = data?.identification_number?.trim() || undefined;
		const constitutionType = (
			data.constitution_type === undefined ||
			data.constitution_type === null ||
			Number(data.constitution_type) === -1
		) ? undefined : Number(data.constitution_type);

		setFilters((prev) => ({
			...prev,
			identification_number: identification,
			constitution_type: constitutionType

		}));
	}

	return (
		<div className="flex flex-col gap-4">
			{GetSuppliers.isPending && (
				<Loader title="Cargando proveedores..." />
			)}

			<div className="w-full flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start">
				<Button
					type="button"
					size="giant"
					label="Agregar Proveedor"
					icon={<PackagePlusIcon size={20} />}
					className="w-full! md:w-auto! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
					onClick={() => {
						setSelectedSupplier(null);
						setIsSupplierModalOpen(true);
					}}
				/>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtre la lista de proveedores
					</small>
				</div>
			</div>

			<form onSubmit={handleSubmit(handleFilterSuppliers)}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
			>

				<Controller
					name="constitution_type"
					control={control}
					render={({ field }) => (
						<Dropdown
							label="Tipo de constitución"
							placeholder="Seleccione..."
							appearance="dark"
							options={ConstitutionOptions ?? []}
							value={field.value ?? null}
							onChange={(value) => {
								const parsed = value === null || value === undefined || value === ""
									? undefined
									: Number(value);
								field.onChange(
									parsed === -1 || Number.isNaN(parsed) ? undefined : parsed,
								);
							}}
							className={dropdownClassName}
							labelClassName={labelClassName}
							valueClassName={labelClassName}
						/>
					)}
				/>

				<InputText
					label="Identificación"
					placeholder="Ej. J0310000000001"
					className={inputClassName}
					labelClassName={labelClassName}
					{...register("identification_number", {
						setValueAs: (value: string) => value ? value.toString().replace(/-/g, "").toUpperCase() : "",
						onChange: (evt) => {
							if (isLegalPerson) {
								evt.target.value = formatRuc(evt.target.value);
							} else if (isNaturalPerson) {
								evt.target.value = formatIdentificationNumber(evt.target.value);
							}
						}
					})
					}
				/>

				<Button
					type="submit"
					size="giant"
					label="Aplicar filtros"
					className="w-full! text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!"
				/>

				<Button
					type="button"
					size="giant"
					label="Limpiar filtros"
					onClick={handleClearFilters}
					className="w-full! text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
				/>
			</form>

			<div className="flex flex-col">
				<DataTable
					title="Lista de proveedores"
					data={suppliers}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={currentPage}
							pageSize={PAGE_SIZE}
							totalRecords={totalRecords}
							onPageChange={handlePageChange}
							disabled={GetSuppliers.isFetching}
						/>
					}
				/>
			</div>

			<SupplierModal
				isOpen={isSupplierModalOpen}
				onClose={() => {
					setIsSupplierModalOpen(false);
					setSelectedSupplier(null);
				}}
				onSubmit={() => {
					setIsSupplierModalOpen(false);
					setSelectedSupplier(null);
				}}
				onRequestSuccess={handleRequestSuccess}
				onRequestError={handleRequestError}
				selectedSupplier={selectedSupplier}
			/>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>
		</div>
	);
};
