import { useEffect, useRef, useState } from "react";

import {
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";

import {
	AccordionGroup,
	Alert,
	AnimatedAlertWrapper,
	Badges,
	Button,
	Modal,
} from "@alpac/design-system";

import {
	quoteFormPrimaryButtonClassName,
	quoteFormSecondaryButtonClassName,
} from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/styles/create-quote-form.styles";

import { FileTextIcon, PlusIcon, SaveIcon, XIcon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { QuoteDetailAccordion } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-detail-accordion/quote-detail-accordion";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import { purchaseRequestTypeBadgeVariants } from "../../../purchase-requests/purchase-request.variants";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { Loader } from "@app/shared/components/loaders/loader";
import { SelectSupplierModal } from "./components/select-supplier-modal/select-supplier-modal";

import type { GetSuppliersResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-suppliers-response";
import type { CreateQuoteModalProps } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/types/create-quote-modal.types";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import { QuoteProductModal } from "./components/quote-products-modal/quote-product-modal";
import type { RequestedProducts } from "./types/create-quote-form.types";

const defaultFormValues: RequestedProducts = {	
	requested_products: []
};

export function CreateQuoteModal({
	isOpen,
	onClose,
	onQuoteCreated,
	purchaseRequest,
	onRequestError,
	onRequestSuccess
}: CreateQuoteModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const methods = useForm<RequestedProducts>({
		defaultValues: defaultFormValues,
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	const { fields } = useFieldArray({
		control,
		name: "requested_products",
	});

	const [openProducts, setOpenProducts] = useState<string[]>([]);
	const [isSelectSupplierOpen, setIsSelectSupplierOpen] = useState(false);
	const [isQuoteProductModalOpen, setIsQuoteProductModalOpen] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState<PurchaseRequestProductInformation[]>([]);

	const {
		alertState,
		handleCloseAlert,
	} = useAlertState();

	const purchaseRequestId = isOpen
		? (purchaseRequest?.purchase_request_id ?? "")
		: "";

	const { GetPurchaseRequestDetails } = usePurchase({
		getPurchaseRequestDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId,
		},
	});

	const {
		data: purchaseRequestDetails,
		isLoading: isLoadingPurchaseRequestDetails,
		isFetching: isFetchingPurchaseRequestDetails,
	} = GetPurchaseRequestDetails;

	const isLoading =
		isOpen &&
		(isLoadingPurchaseRequestDetails || isFetchingPurchaseRequestDetails);

	useEffect(() => {
		if (!isOpen) {
			reset(defaultFormValues);
			setOpenProducts([]);
			return;
		}

		const requestId = purchaseRequestDetails?.purchase_request_id;

		if (!purchaseRequestDetails || !requestId) return;

		const requestedProducts = purchaseRequestDetails.requested_products ?? [];

		reset({
			...defaultFormValues,
			requested_products: requestedProducts.map(
				(product) => ({
					...product,
					suppliers: [],
				}),
			),
		});
		setOpenProducts([]);
	}, [isOpen, purchaseRequestDetails, reset]);


	const handleSelectRegisteredSuppliers = (suppliers: GetSuppliersResponse[]) => {

	};

	const handleCancel = () => {
		reset(defaultFormValues);
		setOpenProducts([]);
		onClose();
	};

	const handleSelectProduct = (product: PurchaseRequestProductInformation, isSelected: boolean) => {

		const productSet = new Set();
		const productIds = selectedProducts?.map(item => item?.product_details?.product_id);
		productSet.add([...productIds]);

		const hasProduct = productSet.has(product.product_details.product_id) && isSelected;

		if (hasProduct) return;

		if (!isSelected) {
			setSelectedProducts((prevArray) => prevArray.filter(item => item.product_details.product_id !== product.product_details.product_id));
		} else {
			setSelectedProducts((prevArray) => [...prevArray, product]);
		}
	}

	const handleQuoteProducts = () => {
		if (selectedProducts.length < 1) {
			onRequestError?.("Seleccione al menos un producto para cotizar");
			return;
		}

		setIsQuoteProductModalOpen(true);
	}

	const onSubmit = (values: RequestedProducts) => {
		onQuoteCreated(values);
		reset(defaultFormValues);
		setOpenProducts([]);

		onClose();
	};

	return (
		<>
			{isLoading && <Loader title="Cargando Productos Solicitados..." />}
			<Modal
				isOpen={isOpen}
				onClose={handleCancel}
				variant="form"
				size="9xl"
				title="Detalle de solicitud de compras"
				description={
					purchaseRequest?.code
						? `Complete el formulario para registrar una cotización de la solicitud ${purchaseRequest.code}.`
						: "Complete el formulario para registrar una nueva cotización."
				}
				panelClassName={[
					"flex h-[54rem] w-[56rem] min-w-0 flex-col",
				].join(" ")}
				contentClassName="flex min-h-0 flex-1 flex-col"
			>
				<FormProvider {...methods}>
					<form
						onSubmit={handleSubmit(onSubmit, () => { })}
						className="flex min-h-0 flex-1 flex-col"
						noValidate
					>
						<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
							<div className="flex flex-col gap-4 pb-2">
								{purchaseRequest?.code ? (
									<section className="flex items-center gap-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-600 dark:bg-[#1e2229]">
										<span className="flex shrink-0 items-center justify-center rounded-md bg-alpac-primary-500/10 text-alpac-primary-600 dark:text-alpac-primary-300">
											<FileTextIcon size={18} />
										</span>
										<div className="flex min-w-0 items-center gap-2">
											<span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Código Solicitud:
											</span>
											<Badges
												label={purchaseRequest?.code ?? ""}
												color="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
											/>
										</div>
										<div className="flex min-w-0 items-center gap-2">
											<span className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
												Tipo de solicitud:
											</span>
											<span>
												<Badges
													label={
														purchaseRequestTypeBadgeVariants[
															purchaseRequest.request_type as keyof typeof purchaseRequestTypeBadgeVariants
														]?.label ?? ""
													}
													color={
														purchaseRequestTypeBadgeVariants[
															purchaseRequest.request_type as keyof typeof purchaseRequestTypeBadgeVariants
														]?.badgeColor ??
														purchaseRequestTypeBadgeVariants.default.badgeColor
													}
												/>
											</span>
										</div>
									</section>
								) : null}

								<section className="flex flex-col gap-4 dark:border-t-neutral-600">
									<div className="flex items-center justify-between gap-2">
										<h3 className="m-0! text-[16px]! font-bold text-slate-800 dark:text-white!">
											Productos solicitados
										</h3>

										{!!selectedProducts?.length &&
											<Button
												type="button"
												label={`Cotizar Producto${selectedProducts?.length > 1 ? "s" : ""}`}
												size="giant"
												disabled={false}
												onClick={handleQuoteProducts}
												icon={<PlusIcon size={20} />}
												className={quoteFormPrimaryButtonClassName}
												isHiddenLabelOnMobile
											/>
										}


									</div>

									{fields.length === 0 ? (
										<p className="m-0 text-sm text-slate-500 dark:text-slate-400">
											Aún no hay productos agregados a esta cotización.
										</p>
									) : (
										<AccordionGroup
											type="multiple"
											value={openProducts}
											onValueChange={(value) => {
												const validateValue = Array.isArray(value)
													? value
													: value
														? [value]
														: [];
												setOpenProducts(validateValue);
											}}
											className="gap-3 pb-3"
										>
											{fields.map((field, index) => (
												<QuoteDetailAccordion
													key={field.id}
													accordionValue={field.id}
													quoteDetailIndex={index}
													requestedProduct={field}
													onSelectedChange={handleSelectProduct}
												/>
											))}
										</AccordionGroup>
									)}
								</section>
							</div>
						</div>

						<div className="-mx-4 -mb-4 mt-0 shrink-0 border-t border-t-slate-300 bg-white px-4 py-4 dark:border-t-neutral-600 dark:bg-[#272b34] sm:-mx-6 sm:-mb-6 sm:px-6 rounded-b-xl">
							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
								<Button
									type="button"
									label="Descartar"
									size="giant"
									disabled={isSubmitting}
									onClick={handleCancel}
									isHiddenLabelOnMobile
									icon={<XIcon size={20} />}
									className={quoteFormSecondaryButtonClassName}
								/>
								<Button
									type="submit"
									label="Guardar cotización"
									size="giant"
									isLoading={isSubmitting}
									disabled={isSubmitting}
									isHiddenLabelOnMobile
									icon={<SaveIcon size={20} />}
									className={quoteFormPrimaryButtonClassName}
								/>
							</div>
						</div>
					</form>
				</FormProvider>
			</Modal>

			<SelectSupplierModal
				isOpen={isSelectSupplierOpen}
				onClose={() => setIsSelectSupplierOpen(false)}
				selectionType="multiple"
				excludeSupplierIds={[]}
				onSelect={handleSelectRegisteredSuppliers}
			/>

			<QuoteProductModal
				isOpen={isQuoteProductModalOpen}
				onClose={() => setIsQuoteProductModalOpen(false)}
				products={selectedProducts}
				onConfirm={(items) => {
					setIsQuoteProductModalOpen(false);
					setSelectedProducts([]);
				}}
			/>

			<AnimatedAlertWrapper open={alertState?.open ?? false}>
				<Alert
					type={alertState?.type!}
					title={alertState?.title}
					message={alertState?.message!}
					onClose={handleCloseAlert}
				/>
			</AnimatedAlertWrapper>
		</>
	);
}
