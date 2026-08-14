import { useEffect, useState } from "react";

import {
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";

import {
	AccordionGroup,
	Avatar,
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
import { purchaseRequestTypeBadgeVariants } from "../../../purchase-requests/purchase-request.variants";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { Loader } from "@app/shared/components/loaders/loader";
import { QuoteProductModal } from "./components/quote-products-modal/quote-product-modal";
import type { CreateQuoteModalProps } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/types/create-quote-modal.types";
import type { PurchaseRequestProductInformation } from "@app/modules/purchasing/domain/ApiContract/Responses/purchase/get-purchase-request-details-response";
import type { RequestedProducts } from "./types/create-quote-form.types";
import type { QuotationItem, RegisterQuoteRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/quote/register-quote-request";
import { useQuotes } from "@app/modules/purchasing/ui/hooks/quote/useQuote";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { DetailField } from "@app/shared/components/detail-field/detail-field";

const defaultFormValues: RequestedProducts = {
	requested_products: []
};

export function CreateQuoteModal({
	isOpen,
	onClose,
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
	const [isQuoteProductModalOpen, setIsQuoteProductModalOpen] = useState(false);
	const [selectedProducts, setSelectedProducts] = useState<PurchaseRequestProductInformation[]>([]);
	const [quotationItems, setQuotationItems] = useState<QuotationItem[]>();

	const purchaseRequestId = isOpen
		? (purchaseRequest?.purchase_request_id ?? "")
		: "";

	const { GetPurchaseRequestDetails, GetPurchaseRequestProducts } = usePurchase({
		getPurchaseRequestDetailsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId
		},
		getPurchaseRequestProductsPayload: {
			company_id: companyId,
			module_code: moduleCode,
			purchase_request_id: purchaseRequestId
		}
	});

	const { RegisterQuote } = useQuotes();
	const { getMappedError } = useMappedError();

	const {
		data: purchaseRequestDetails,
		isLoading: isLoadingPurchaseRequestDetails,
		isFetching: isFetchingPurchaseRequestDetails,
	} = GetPurchaseRequestDetails;

	const {
		data: purchaseRequestProducts,
		isLoading: isLoadingPurchaseRequestProducts,
		isFetching: isFetchingPurchaseRequestProducts
	} = GetPurchaseRequestProducts;

	const isRegisteringQuote = RegisterQuote.isPending;

	const isLoading = isOpen &&
		((
			isLoadingPurchaseRequestDetails ||
			isFetchingPurchaseRequestDetails ||
			isLoadingPurchaseRequestProducts ||
			isFetchingPurchaseRequestProducts
		) || isRegisteringQuote);

	const resetQuoteDraft = () => {
		reset(defaultFormValues);
		setOpenProducts([]);
		setSelectedProducts([]);
		setQuotationItems(undefined);
		setIsQuoteProductModalOpen(false);
	};

	useEffect(() => {
		if (!isOpen) {
			resetQuoteDraft();
			return;
		}

		const requestId = purchaseRequestDetails?.purchase_request_id;

		if (!purchaseRequestDetails || !requestId) return;

		const requestedProducts = purchaseRequestProducts?.data ?? [];

		reset({
			...defaultFormValues,
			requested_products: requestedProducts.map((product: PurchaseRequestProductInformation) => ({ ...product, suppliers: [] }))
		});
	}, [isOpen, purchaseRequestDetails, purchaseRequestProducts, reset]);

	useEffect(() => {
		if (!isOpen || fields.length === 0) return;
		setOpenProducts(fields.map((field) => field.id));
	}, [isOpen, fields]);


	const handleCancel = () => {
		resetQuoteDraft();
		onClose();
	};

	const handleSelectProduct = (product: PurchaseRequestProductInformation, isChecked: boolean) => {
		const productId = product.product_details.product_id;

		setSelectedProducts((prevArray) => {
			if (!isChecked) {
				return prevArray.filter((item) => item.product_details.product_id !== productId);
			}

			if (prevArray.some((item) => item.product_details.product_id === productId)) {
				return prevArray;
			}

			return [...prevArray, product];
		});
	};

	const handleCloseQuoteProductModal = () => {
		setIsQuoteProductModalOpen(false);
		setSelectedProducts([]);
	};

	const handleQuoteProducts = () => {
		if (selectedProducts.length < 1) {
			onRequestError?.("Seleccione al menos un producto para cotizar");
			return;
		}

		setIsQuoteProductModalOpen(true);
	}

	const onSubmit = (_values: RequestedProducts) => {

		if (!quotationItems?.length) {
			onRequestError?.(
				"Debe cotizar al menos un producto con sus proveedores antes de guardar.",
			);
			return;
		}

		const payload: RegisterQuoteRequest = {
			company_id: companyId,
			module_code: moduleCode,
			quotation_items: quotationItems,
		};

		RegisterQuote.mutate(payload, {
			onSuccess() {
				onRequestSuccess?.("Cotización registrada con éxito.");
				resetQuoteDraft();
				onClose();
			},
			onError(error) {
				const mappedError = getMappedError(error);
				onRequestError?.(
					mappedError.description || "Error al registrar la cotización.",
				);
			},
		});
	};

	return (
		<>
			{isLoading && (
				<Loader
					title={
						isRegisteringQuote
							? "Registrando cotización..."
							: "Cargando Productos Solicitados..."
					}
				/>
			)}
			<Modal
				isOpen={isOpen}
				onClose={handleCancel}
				variant="form"
				size="8xl"
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
						onSubmit={handleSubmit(onSubmit)}
						className="flex min-h-0 flex-1 flex-col"
						noValidate
					>
						<div className="scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
							<div className="flex flex-col gap-4 pb-2">
								{purchaseRequest?.code ? (
									<section className="flex items-start gap-3 overflow-hidden rounded-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-600 dark:bg-[#1e2229]">
										<span className="mt-0.5 flex shrink-0 items-center justify-center rounded-md bg-alpac-primary-500/10 text-alpac-primary-600 dark:text-alpac-primary-300">
											<FileTextIcon size={18} />
										</span>

										<div className="grid min-w-0 flex-1 grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
											<div className="flex min-w-0 flex-col gap-1">
												<span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
													Código Solicitud
												</span>
												<span className="min-w-0 max-w-full overflow-hidden">
													<Badges
														label={purchaseRequest?.code ?? ""}
														color="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
													/>
												</span>
											</div>

											<div className="flex min-w-0 flex-col gap-1">
												<span className="whitespace-nowrap text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
													Tipo de solicitud
												</span>
												<span className="min-w-0 max-w-full overflow-hidden">
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

											<div className="flex min-w-0 flex-col gap-1">
												<DetailField
													label="Solicitante"
													value={purchaseRequestDetails?.creator_user_information?.fullname ?? ""}
													icon={<Avatar label={purchaseRequestDetails?.creator_user_information?.fullname ?? ""} hasLabel={false} />}
												/>
											</div>

											<div className="flex min-w-0 flex-col gap-1">
												<DetailField
													label="Aprobado Por"
													value={purchaseRequestDetails?.reviewer_user_information?.fullname ?? ""}
													icon={<Avatar label={purchaseRequestDetails?.reviewer_user_information?.fullname ?? ""} hasLabel={false} />}
												/>
											</div>
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
													isSelected={selectedProducts.some(
														(item) => item.product_details.product_id === field.product_details?.product_id,
													)}
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
									disabled={isSubmitting || isRegisteringQuote}
									onClick={handleCancel}
									isHiddenLabelOnMobile
									icon={<XIcon size={20} />}
									className={quoteFormSecondaryButtonClassName}
								/>
								<Button
									type="submit"
									label="Guardar cotización"
									size="giant"
									isLoading={isSubmitting || isRegisteringQuote}
									disabled={isSubmitting || isRegisteringQuote}
									isHiddenLabelOnMobile
									icon={<SaveIcon size={20} />}
									className={quoteFormPrimaryButtonClassName}
								/>
							</div>
						</div>
					</form>
				</FormProvider>
			</Modal>

			<QuoteProductModal
				isOpen={isQuoteProductModalOpen}
				onClose={handleCloseQuoteProductModal}
				products={selectedProducts}
				onConfirm={(items) => {
					setQuotationItems(items);
					handleCloseQuoteProductModal();
				}}
			/>
		</>
	);
}
