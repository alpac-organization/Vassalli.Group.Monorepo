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

import { FileTextIcon, SaveIcon, XIcon } from "lucide-react";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { QuoteDetailAccordion } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/components/quote-detail-accordion/quote-detail-accordion";
import { useAlertState } from "@app/shared/hooks/useAlertState";
import type { CreateQuoteModalProps } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/create-quote-modal.types";
import { type CreateQuote } from "@app/modules/purchasing/ui/pages/quotes/components/create-quote-modal/types/create-quote-form.types";
import { purchaseRequestTypeBadgeVariants } from "../../../purchase-requests/purchase-request.variants";
import { usePurchase } from "@app/modules/purchasing/ui/hooks/purchase/usePurchase";
import { Loader } from "@app/shared/components/loaders/loader";

const defaultFormValues: CreateQuote = {
	branch_id: "",
	quote_date: "",
	observations: "",
	requested_products: [],
};

export function CreateQuoteModal({
	isOpen,
	onClose,
	onQuoteCreated,
	purchaseRequest,
}: CreateQuoteModalProps) {
	const { companyId, moduleCode } = useUserStore();

	const methods = useForm<CreateQuote>({
		defaultValues: defaultFormValues,
		mode: "onSubmit",
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = methods;

	const { fields, remove } = useFieldArray({
		control,
		name: "requested_products",
	});

	const [openProducts, setOpenProducts] = useState<string[]>([]);
	const hydratedRequestIdRef = useRef<string | null>(null);

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
			hydratedRequestIdRef.current = null;
			return;
		}

		const requestId = purchaseRequestDetails?.purchase_request_id;
		if (!purchaseRequestDetails || !requestId) return;
		if (hydratedRequestIdRef.current === requestId) return;

		hydratedRequestIdRef.current = requestId;
		reset({
			...defaultFormValues,
			requested_products: purchaseRequestDetails.requested_products ?? [],
		});
		setOpenProducts([]);
	}, [isOpen, purchaseRequestDetails, reset]);

	const handleCancel = () => {
		reset(defaultFormValues);
		setOpenProducts([]);
		hydratedRequestIdRef.current = null;
		onClose();
	};

	const onSubmit = (values: CreateQuote) => {
		onQuoteCreated(values);
		reset(defaultFormValues);
		setOpenProducts([]);
		hydratedRequestIdRef.current = null;
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
												label={purchaseRequest.code}
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
											Productos
										</h3>
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
													onRemove={() => remove(index)}
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
