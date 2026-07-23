import { useEffect, useMemo, useState } from "react";
import {
	Button,
	DataTable,
	InputText,
	Modal,
	Pagination,
	RadioButton,
	type TableColumn,
} from "@alpac/design-system";
import { Loader } from "@app/shared/components/loaders/loader";
import { useUserStore } from "@app/shared/stores/useUserStore";
import type { QuoteSelectionModalProps } from "./quote-selection-modal.types";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const labelClassName = "text-black! dark:text-white!";
const PAGE_SIZE = 5;

export const QuotesSelectionModal = ({
	isOpen,
	onClose,
	onSubmit,
	onRequestError,
	onRequestSuccess,
	selectionType,
	selectedQuoteId = null,
}: QuoteSelectionModalProps) => {

	// const { companyId, moduleCode } = useUserStore();
	const [search, setSearch] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [tempSelected, setTempSelected] = useState<any | null>(null);

	/* const { GetQuotes } = useQuotes({
		suppliersFilters: {
			companie_id: companyId,
			module_code: moduleCode,
			page_number: pageNumber,
			page_size: PAGE_SIZE,
		},
	}); */

	// const quotes = GetQuotes.data?.data ?? [];
	// const totalRecords = GetQuotes.data?.total ?? 0;

	/*const filteredQuotes = useMemo(() => {
		const term = search.trim().toLowerCase();
		if (!term) return quotes;

		return quotes.filter((quote) => {			
			return quote
		});
	}, [search, quotes]);*/

	/*useEffect(() => {
		if (!isOpen) {
			setSearch("");
			setPageNumber(1);
			setTempSelected(null);
			return;
		}

		if (!selectedQuoteId) {
			setTempSelected(null);
			return;
		}

		const matched = quotes.find(
			(quote) => quote.supplier_id === selectedQuoteId,
		);
		if (matched) setTempSelected(matched);
	}, [isOpen, selectedQuoteId, quotes]);*/

	const handleClose = () => {
		onClose();
	};

	const handleConfirm = () => {
		if (selectionType !== "single") return;

		if (!tempSelected) {
			onRequestError?.("Debe seleccionar un proveedor");
			return;
		}

		onSubmit?.(tempSelected);
		onClose();
	};

	const columnConfig: TableColumn<any>[] = useMemo(
		() => [
			{
				key: "select",
				label: "",
				render: (row: any) => (
					<RadioButton
						name="quote-selection"
						checked={tempSelected?.quote_id === row.quote_id}
						onChange={() => setTempSelected(row)}
						aria-label="Seleccionar"
					/>
				),
			},			
		],
		[tempSelected],
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Selección de Cotización"
			variant="form"
			size="5xl"
			description="Busque y seleccione la cotización requerida"
		>
			{/* {GetSuppliers.isPending && <Loader title="Cargando proveedores..." />} */}

			<div className="flex flex-col gap-4">
				<InputText
					label="Buscar"
					placeholder="Razón social, identificación o contacto"
					className={inputClassName}
					labelClassName={labelClassName}
					value={search}
					onChange={(event) => setSearch(event.target.value)}
				/>

				<DataTable
					title="Proveedores disponibles"
					data={[]
						// filteredSuppliers
					}
					columns={columnConfig}
					pagination={
						<Pagination
							currentPage={pageNumber}
							pageSize={PAGE_SIZE}
							totalRecords={0
								// totalRecords
							}
							onPageChange={setPageNumber}
							disabled={false
								// GetSuppliers.isFetching
							}
						/>
					}
				/>

				<div className="flex justify-end gap-3 pt-2">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						onClick={handleClose}
						className="text-[15px]! rounded-md! text-white! bg-slate-500! dark:bg-slate-700!"
					/>
					<Button
						type="button"
						size="giant"
						label="Seleccionar"
						onClick={handleConfirm}
						disabled={!tempSelected}
						className="text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700! disabled:opacity-50!"
					/>
				</div>
			</div>
		</Modal>
	);
};
