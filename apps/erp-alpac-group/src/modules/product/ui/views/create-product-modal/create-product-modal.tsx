import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, InputText, Modal, Textarea } from "@alpac/design-system";
import { Controller, useForm } from "react-hook-form";
import type { CreatedProductDto, CreateProductModalProps } from "./create-product-modal.types";
import type { CreateProductRequest } from "@app/modules/product/domain/ApiContract/Requests/product/create-product.request";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { useProduct } from "../../hooks/useProduct";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import type { GetProductCategoryResponse } from "@app/modules/product/domain/ApiContract/Responses/product-category/get-product-category.response";
import type { ApiErrorResponse } from "@app/core/interfaces/ErrorResponse";

const inputClassName =
	"w-full! rounded-md! text-[15px]! text-white! dark:bg-[#272b34]! dark:border-slate-600! dark:hover:border-neutral-600! dark:placeholder:text-slate-500!";
const dropdownClassName = `${inputClassName} focus:border-blue-600! focus:ring-2! focus:ring-green-50/50!`;
const labelClassName = "text-black! dark:text-white!";
const primaryButtonClassName =
	"text-[15px]! rounded-md! text-white! bg-alpac-primary-500! dark:bg-alpac-primary-700!";
const secondaryButtonClassName =
	"text-[15px]! rounded-md! text-slate-500! hover:bg-slate-200! bg-slate-500! dark:bg-slate-700! dark:text-slate-300! dark:hover:bg-slate-600!";

const emptyFormValues = (
	companyId: string,
	moduleCode: string,
): CreateProductRequest => ({
	company_id: companyId,
	module_code: moduleCode,
	product_code: "",
	product_name: "",
	description: "",
	category_id: "",
});

export const CreateProductModal = ({
	isOpen,
	onClose,
	onSubmit,
	onRequestSuccess,
	onRequestError,
}: CreateProductModalProps) => {

	const { companyId, moduleCode } = useUserStore();
	const { getMappedError } = useMappedError();

	const [selectedProductCategory, setSelectedProductCategory] = useState<string>("");

	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateProductRequest>({
		defaultValues: emptyFormValues(companyId, moduleCode),
		mode: "onSubmit",
	});

	const { GetProductCategories, CreateProduct } = useProduct({
		getProductCategoryPayload: {
			company_id: companyId,
			module_code: moduleCode,
		},
	});

	const productCategories = useMemo(() => {
		if (!GetProductCategories.data || !Array.isArray(GetProductCategories.data)) {
			return [];
		}

		const categories: GetProductCategoryResponse[] = GetProductCategories.data;
		return categories.map((item) => ({
			value: item.id,
			label: item.name,
		}));
	}, [GetProductCategories.data]);

	const isSaving = CreateProduct.isPending;

	useEffect(() => {
		if (!isOpen) {
			reset(emptyFormValues(companyId, moduleCode));
			return;
		}

		reset(emptyFormValues(companyId, moduleCode));
	}, [isOpen, companyId, moduleCode, reset]);

	const handleClose = () => {
		reset(emptyFormValues(companyId, moduleCode));
		onClose();
	};

	const handleCreateProduct = (values: CreateProductRequest) => {

		const payload: CreateProductRequest = {
			...values,
			company_id: companyId,
			module_code: moduleCode,
			product_name: values.product_name?.trim(),
			product_code: values.product_code?.trim(),
			description: values.description?.trim() || undefined,
		};		

		CreateProduct.mutate(payload, {
			onSuccess(product) {

				const createdProduct: CreatedProductDto = {
					data: product,
					product_name: payload.product_name,
					category_name: selectedProductCategory ?? ""
				}

				onRequestSuccess?.("Producto registrado correctamente.");
				onSubmit?.(createdProduct);
				handleClose();
			},
			onError(error) {
				const mappedError = getMappedError(error as ApiErrorResponse);
				onRequestError?.(
					mappedError.description || "No se pudo registrar el producto.",
				);
			},
		});
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Registro de producto"
			variant="form"
			size="7xl"
			description="Complete el formulario para registrar un nuevo producto."
		>
			<form
				onSubmit={handleSubmit(handleCreateProduct)}
				className="flex flex-col gap-6"
				noValidate
			>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">

					<InputText
						label="Código de producto"
						placeholder="Ingrese el código de producto"
						isRequired
						error={errors.product_code?.message}
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("product_code", {
							required: "El código del producto es obligatorio.",
							validate: (value) =>
								value.trim().length > 0 ||
								"El código del producto es obligatorio.",
							maxLength: {
								value: 100,
								message:
									"El código del producto no puede exceder los 100 caracteres.",
							},
							onChange(evt) {
								evt.target.value = evt.target.value.toUpperCase();
							}
						})}
					/>

					<InputText
						label="Nombre del producto"
						placeholder="Ej: Aceite Motor 15W40"
						isRequired
						error={errors.product_name?.message}
						className={inputClassName}
						labelClassName={labelClassName}
						{...register("product_name", {
							required: "El nombre del producto es obligatorio.",
							validate: (value) =>
								value.trim().length > 0 ||
								"El nombre del producto es obligatorio.",
							maxLength: {
								value: 50,
								message:
									"El nombre del producto no puede exceder los 50 caracteres.",
							},
						})}
					/>

					<Controller
						control={control}
						name="category_id"
						rules={{ required: "La categoría es obligatoria." }}
						render={({ field, fieldState }) => (
							<Dropdown
								label="Categoría"
								placeholder={
									GetProductCategories.isPending || GetProductCategories.isFetching
										? "Cargando categorías..."
										: "Seleccione una categoría"
								}
								appearance="dark"
								isRequired
								value={field.value}
								onChange={(value) => {
									field.onChange(value);
									const [category] = productCategories.filter(item => item.value === value);
									setSelectedProductCategory(category.label);
								}}
								options={productCategories ?? []}
								error={fieldState.error?.message}
								labelClassName={labelClassName}
								className={dropdownClassName}
							/>
						)}
					/>

				</div>

				<Textarea
					label="Descripción"
					placeholder="Descripción opcional del producto..."
					rows={4}
					className={`${inputClassName} resize-none`}
					labelClassName={labelClassName}
					{...register("description")}
					maxLength={500}
					enableCharacterCount
				/>

				<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						size="giant"
						label="Cancelar"
						disabled={isSaving}
						className={secondaryButtonClassName}
						onClick={handleClose}
					/>
					<Button
						type="submit"
						size="giant"
						label="Guardar producto"
						isLoading={isSaving}
						disabled={isSaving}
						className={primaryButtonClassName}
					/>
				</div>
			</form>
		</Modal>
	);
};
