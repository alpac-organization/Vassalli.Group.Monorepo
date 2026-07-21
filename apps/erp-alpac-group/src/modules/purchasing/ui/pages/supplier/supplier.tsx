import { useCallback, useMemo, useState } from "react";
import {
	Alert,
	AnimatedAlertWrapper,
	Breadcrumb,
	Button,
	ContextMenu,
	DataTable,
	Dropdown,
	InputText,
	Pagination,
	useTheme,
	type TableColumn,
} from "@alpac/design-system";
import { useBaseUrl } from "@app/shared/hooks/useBaseUrl";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { m } from "framer-motion";
import { PackagePlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SupplierModal } from "./components/supplier-modal/supplier-modal";
import { ConstitutionOptions } from "@app/core/enums/constitution.enum";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { useSuppliers } from "@app/modules/purchasing/ui/hooks/suppliers/useSuppliers";
import type { GetSuppliersRequest } from "@app/modules/purchasing/domain/suppliers/requests/get-suppliers-request";
import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/suppliers/responses/get-suppliers-response";
import { Loader } from "@app/shared/components/loaders/loader";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName =
	"w-full! focus:ring-2! focus:ring-green-50/50! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

const statusOptions = [
	{ label: "Activo", value: "active" },
	{ label: "Inactivo", value: "inactive" },
];

export const Supplier = () => {
	const navigate = useNavigate();
	const { baseUrl } = useBaseUrl();
	const { theme } = useTheme();
	const { urlImage, neutralUrlImage } = useCompanyStore();
	const { companyId, moduleCode } = useUserStore();

	const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
	const [supplierName, setSupplierName] = useState("");
	const [identification, setIdentification] = useState("");
	const [status, setStatus] = useState<string>("");
	const [constitutionType, setConstitutionType] = useState<number | null>(null);
	const [selectedSupplier, setSelectedSupplier] = useState<GetSuppliersResponse | null>(null)
	const [filters, setFilters] = useState<GetSuppliersRequest>({
		companie_id: companyId,
		module_code: moduleCode,
		page_number: 1,
		page_size: PAGE_SIZE,
	});

	const {
		alertState,
		handleCloseAlert,
		handleRequestError,
		handleRequestSuccess,
	} = useAlertState();

	const { GetSuppliers } = useSuppliers({
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
	const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

	const handleClearFilters = () => {
		setSupplierName("");
		setIdentification("");
		setStatus("");
		setConstitutionType(null);
		setFilters({
			companie_id: companyId,
			module_code: moduleCode,
			page_number: 1,
			page_size: PAGE_SIZE,
		});
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
		console.log(data)
	}

	const columnConfig: TableColumn<GetSuppliersResponse>[] = useMemo(
		() => [
			{ key: "supplier_legal_name", label: "Razón social" },
			{
				key: "identification_number",
				label: "Identificación",
				render: (row: GetSuppliersResponse) => row.identification_type,
			},
			{ key: "contact_name", label: "Contacto" },
			{ key: "contact_phone_number", label: "Teléfono" },
			{ key: "contact_email", label: "Correo Contacto" },
			{ key: "email_support", label: "Correo Soporte" },
			{
				key: "constitution_type",
				label: "Constitución",
				render: (row: GetSuppliersResponse) => row.constitution_type,
			},
			{
				key: "actions",
				label: "Acciones",
				render: (row: GetSuppliersResponse) => (
					<ContextMenu
						items={[
							{ label: "Editar", onClick: () => onEditSupplier(row) },
							{ label: "Ver detalle", onClick: () => onViewDetails(row) },
						]}
					/>
				),
			},
		],
		[],
	);

	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col gap-4"
		>
			{GetSuppliers.isPending && (
				<Loader title="Cargando proveedores..." />
			)}

			<div className="flex justify-start">
				<Breadcrumb
					items={[
						{
							label: "Dashboard",
							url: `${baseUrl}/`,
							onClick: (url) => navigate(url),
						},
						{
							label: "Proveedores",
							url: `${baseUrl}/purchasing/suppliers`,
							onClick: (url) => navigate(url),
						},
					]}
				/>
			</div>

			<div className="flex flex-col">
				<div className="flex justify-between items-center">
					<div className="flex flex-col justify-center">
						<h3 className="p-0! m-0!">Proveedores</h3>
						<small className="text-gray-500 dark:text-gray-300">
							Gestión de Proveedores
						</small>
					</div>
					<img
						className="h-12 sm:h-16 md:h-20 w-auto object-contain"
						src={activeLogo}
						alt="logo alpac"
					/>
				</div>
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Accesos Directos</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Acciones rápidas de proveedores
					</small>
				</div>
			</div>

			<div className="w-full dark:bg-[#272b34]! p-4 rounded-md border border-slate-600 dark:border-neutral-600">
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
			</div>

			<div className="flex justify-between items-center pt-4 border-t border-t-slate-600 dark:border-t-neutral-600">
				<div className="flex flex-col justify-center">
					<h3 className="p-0! m-0!">Filtros</h3>
					<small className="text-gray-500 dark:text-gray-300">
						Filtre la lista de proveedores
					</small>
				</div>
			</div>

			<form
				onSubmit={(event) => event.preventDefault()}
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end"
			>
				<InputText
					label="Razón social"
					placeholder="Ej. Distribuidora del Pacífico"
					className={inputClassName}
					labelClassName={labelClassName}
					value={supplierName}
					onChange={(event) => setSupplierName(event.target.value)}
				/>

				<InputText
					label="Identificación"
					placeholder="Ej. J0310000000001"
					className={inputClassName}
					labelClassName={labelClassName}
					value={identification}
					onChange={(event) => setIdentification(event.target.value)}
				/>

				<Dropdown
					label="Tipo de constitución"
					placeholder="Seleccione..."
					appearance="dark"
					options={ConstitutionOptions}
					value={constitutionType}
					onChange={(value) => setConstitutionType(Number(value))}
					className={dropdownClassName}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
				/>

				<Dropdown
					label="Estado"
					placeholder="Seleccione..."
					appearance="dark"
					options={statusOptions}
					value={status}
					onChange={(value) => setStatus(String(value))}
					className={dropdownClassName}
					labelClassName={labelClassName}
					valueClassName={labelClassName}
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
		</m.div>
	);
};
