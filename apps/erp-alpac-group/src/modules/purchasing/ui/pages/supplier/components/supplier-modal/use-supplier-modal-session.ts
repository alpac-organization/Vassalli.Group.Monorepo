import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import {
  resolveSupplierType,
  SupplierTypeEnum,
} from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type {
  CreateSupplierBankAccountPayload,
  SupplierBankAccount,
} from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { useSupplierEditor } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import {
  emptyFormValues,
  hasConstitutionData,
  mapSupplierPaymentMethods,
  resolveConstitutionType,
  resolveIdentificationType,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.mappers";
import {
  buildCreatePayload,
  buildUpdatePayload,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.payloads";
import type {
  CreatedSupplierDto,
  SupplierModalProps,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import { useSupplierChangeTracker } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/use-supplier-change-tracker";
import { useSupplierModalHydrate } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/use-supplier-modal-hydrate";
import {
  validateCatalogLinkPreferentialDates,
  type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";

export type SupplierModalTab = "general" | "commercial" | "bank_accounts" | "products";

const EMPTY_BANK_ACCOUNTS: SupplierBankAccount[] = [];

type SupplierModalSessionArgs = Pick<
  SupplierModalProps,
  "isOpen" | "selectedSupplier" | "onClose" | "onSubmit" | "onRequestSuccess" | "onRequestError"
>;

export const useSupplierModalSession = ({
  isOpen,
  selectedSupplier,
  onClose,
  onSubmit,
  onRequestSuccess,
  onRequestError,
}: SupplierModalSessionArgs) => {
  const companyId = useUserStore((state) => state.companyId);
  const moduleCode = useUserStore((state) => state.moduleCode);
  const isEditMode = Boolean(selectedSupplier?.supplier_id);
  const [activeTab, setActiveTab] = useState<SupplierModalTab>("general");
  const [localBankAccounts, setLocalBankAccounts] = useState<
    CreateSupplierBankAccountPayload[]
  >([]);
  const [productLinks, setProductLinks] = useState<CatalogLinkItemForm[]>([]);
  const [productLinksDirty, setProductLinksDirty] = useState(false);
  const [catalogFullyLoaded, setCatalogFullyLoaded] = useState(true);
  const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);

  const {
    CreateSupplier,
    UpdateSupplier,
    GetSupplierDetails,
    CreateBankAccount,
    UpdateBankAccount,
    DeleteBankAccount,
  } = useSupplierEditor(
    isOpen && selectedSupplier?.supplier_id
      ? {
          company_id: companyId,
          module_code: moduleCode,
          supplier_id: selectedSupplier.supplier_id,
          page_number: 1,
          page_size: 100,
        }
      : undefined,
  );

  const { data: supplierDetails, isPending: isSupplierDetailsPending } =
    GetSupplierDetails;
  const { getMappedError } = useMappedError();

  const trackerInitial = useMemo((): UpdateSupplierRequest => {
    if (!selectedSupplier || !supplierDetails) {
      return {} as UpdateSupplierRequest;
    }

    const constitutionType = resolveConstitutionType(
      supplierDetails.constitution_type,
    );
    const identificationType = resolveIdentificationType(
      supplierDetails.identification_type,
      supplierDetails.constitution_type,
    );
    const identificationNumber = String(
      supplierDetails.identification_number ?? "",
    )
      .replace(/-/g, "")
      .toUpperCase();
    const details = supplierDetails.supplier_details;

    return {
      company_id: companyId,
      module_code: moduleCode,
      supplier_id: selectedSupplier.supplier_id,
      suppliers_legal_name: supplierDetails.supplier_legal_name ?? "-",
      commercial_name: supplierDetails.commercial_name ?? undefined,
      supplier_type:
        resolveSupplierType(supplierDetails.supplier_type) ??
        SupplierTypeEnum.Ordinary.stringValue,
      payment_methods: mapSupplierPaymentMethods(
        supplierDetails.supplier_payment_methods,
      ),
      supplier_details: {
        address: details?.address ?? undefined,
        email_support: details?.email_support ?? undefined,
        contact_name: details?.contact_name ?? undefined,
        contact_email: details?.contact_email ?? undefined,
        contact_phone_number: details?.contact_phone_number ?? undefined,
        credit_days: details?.credit_days ?? 0,
        has_credit: Boolean(details?.has_credit),
        exclusive_brands_or_parts:
          details?.exclusive_brands_or_parts ?? undefined,
        credit_limit: details?.credit_limit ?? null,
        credit_currency: details?.credit_currency ?? "USD",
        alert_days_before_due: details?.alert_days_before_due ?? 5,
        apply_ir_retention: Boolean(details?.apply_ir_retention),
        apply_municipal_retention: Boolean(details?.apply_municipal_retention),
        is_tax_exempt: Boolean(details?.is_tax_exempt),
        preferred_payment_method: details?.preferred_payment_method ?? null,
      },
      ...(hasConstitutionData(constitutionType)
        ? {
            identification_number: identificationNumber,
            constitution_type: constitutionType,
            identification_type: identificationType,
          }
        : {}),
    };
  }, [selectedSupplier, supplierDetails, companyId, moduleCode]);

  const {
    trackField,
    trackDetailField,
    trackMultipleDetailFields,
    reset: resetTracker,
    read: readChanges,
  } = useSupplierChangeTracker(trackerInitial, isEditMode);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<CreateSupplierRequest>({
    defaultValues: emptyFormValues as CreateSupplierRequest,
  });

  const handleProductLinksChange = useCallback(
    (items: CatalogLinkItemForm[]) => {
      setProductLinks(items);
      if (isEditMode) setProductLinksDirty(true);
    },
    [isEditMode],
  );

  const handleSelectProducts = useCallback(
    (products: GetProductResponse[]) => {
      setProductLinks((prev) => {
        const existingIds = new Set(prev.map((item) => item.entity_id));
        const nextItems = products
          .filter((product) => !existingIds.has(product.product_id))
          .map((product) => ({
            entity_id: product.product_id,
            entity_label: product.code
              ? `${product.code} · ${product.product_name}`
              : product.product_name,
            unit_price: "",
            currency: "USD" as const,
            unit_measure_id: product.unit_measure_id ?? "",
            tier_prices: [],
          }));
        return [...prev, ...nextItems];
      });
      if (isEditMode) setProductLinksDirty(true);
    },
    [isEditMode],
  );

  const assignedProductIds = useMemo(
    () => productLinks.map((link) => link.entity_id).filter(Boolean),
    [productLinks],
  );

  const resetSession = useCallback(() => {
    reset(emptyFormValues);
    resetTracker();
    setLocalBankAccounts([]);
    setProductLinks([]);
    setProductLinksDirty(false);
    setCatalogFullyLoaded(true);
    setIsSelectProductOpen(false);
    setActiveTab("general");
  }, [reset, resetTracker]);

  const handleClose = useCallback(() => {
    resetSession();
    onClose();
  }, [onClose, resetSession]);

  useSupplierModalHydrate({
    isOpen,
    selectedSupplier,
    supplierDetails,
    companyId,
    moduleCode,
    reset,
    resetTracker,
    setProductLinks,
    setProductLinksDirty,
    setCatalogFullyLoaded,
  });

  const { mutate: createSupplier } = CreateSupplier;
  const { mutate: updateSupplier } = UpdateSupplier;

  const handleCreateSupplier = useCallback(
    (data: CreateSupplierRequest) => {
      const invalidLink = productLinks.find(
        (link) => !link.entity_id || !link.unit_price.trim(),
      );
      if (invalidLink) {
        onRequestError?.(
          "Cada producto vinculado debe tener selección y precio unitario.",
        );
        setActiveTab("products");
        return;
      }

      const preferentialError = validateCatalogLinkPreferentialDates(productLinks);
      if (preferentialError) {
        onRequestError?.(preferentialError);
        setActiveTab("products");
        return;
      }

      const payload = buildCreatePayload({
        data,
        companyId,
        moduleCode,
        localBankAccounts,
        productLinks,
      });

      createSupplier(payload, {
        onSuccess(supplier) {
          const createdSupplier: CreatedSupplierDto = {
            data: supplier,
            supplier_name: payload.suppliers_legal_name,
          };

          onRequestSuccess?.("Proveedor registrado exitosamente.");
          handleClose();
          onSubmit?.(createdSupplier);
        },
        onError(error) {
          const mappedError = getMappedError(error);
          onRequestError?.(mappedError.description);
        },
      });
    },
    [
      companyId,
      createSupplier,
      getMappedError,
      handleClose,
      localBankAccounts,
      moduleCode,
      onRequestError,
      onRequestSuccess,
      onSubmit,
      productLinks,
    ],
  );

  const handleUpdateSupplier = useCallback(() => {
    if (!selectedSupplier?.supplier_id) return;

    if (productLinksDirty) {
      if (!catalogFullyLoaded) {
        onRequestError?.(
          "Espere a que termine de cargar el catálogo de productos antes de guardar.",
        );
        setActiveTab("products");
        return;
      }

      const invalidLink = productLinks.find(
        (link) => !link.entity_id || !link.unit_price.trim(),
      );
      if (invalidLink) {
        onRequestError?.(
          "Cada producto vinculado debe tener selección y precio unitario.",
        );
        setActiveTab("products");
        return;
      }

      const preferentialError =
        validateCatalogLinkPreferentialDates(productLinks);
      if (preferentialError) {
        onRequestError?.(preferentialError);
        setActiveTab("products");
        return;
      }
    }

    const { payload, skippedEmptyProducts } = buildUpdatePayload({
      companyId,
      moduleCode,
      supplierId: selectedSupplier.supplier_id,
      updateData: readChanges(),
      productLinks,
      productLinksDirty,
      formPreferredPaymentMethod:
        (getValues("supplier_details.preferred_payment_method") as
          | PaymentMethodType
          | null
          | undefined) ?? null,
    });

    const hasChanges = Object.keys(payload).some(
      (key) => !["company_id", "module_code", "supplier_id"].includes(key),
    );

    if (!hasChanges) {
      if (skippedEmptyProducts) {
        onRequestError?.(
          "El catálogo de productos no se puede vaciar desde esta pantalla. Conserve al menos un producto o no toque el catálogo.",
        );
        setActiveTab("products");
        return;
      }
      onRequestSuccess?.("No se detectaron cambios para actualizar.");
      handleClose();
      return;
    }

    updateSupplier(payload, {
      onSuccess() {
        if (skippedEmptyProducts) {
          onRequestSuccess?.(
            "Proveedor actualizado. El catálogo de productos no se modificó porque no se puede vaciar por este endpoint.",
          );
        } else {
          onRequestSuccess?.("Proveedor actualizado exitosamente.");
        }
        handleClose();
      },
      onError(error) {
        const mappedError = getMappedError(error);
        onRequestError?.(mappedError.description);
      },
    });
  }, [
    catalogFullyLoaded,
    companyId,
    getMappedError,
    getValues,
    handleClose,
    moduleCode,
    onRequestError,
    onRequestSuccess,
    productLinks,
    productLinksDirty,
    readChanges,
    selectedSupplier,
    updateSupplier,
  ]);

  const handleSupplier = useCallback(
    (data: CreateSupplierRequest) => {
      if (isEditMode) {
        handleUpdateSupplier();
        return;
      }
      handleCreateSupplier(data);
    },
    [handleCreateSupplier, handleUpdateSupplier, isEditMode],
  );

  const openProductPicker = useCallback(() => {
    setIsSelectProductOpen(true);
  }, []);

  const closeProductPicker = useCallback(() => {
    setIsSelectProductOpen(false);
  }, []);

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as SupplierModalTab);
  }, []);

  const currentBankAccounts = isEditMode
    ? (supplierDetails?.bank_accounts ?? EMPTY_BANK_ACCOUNTS)
    : localBankAccounts;

  const isSubmitting = CreateSupplier.isPending || UpdateSupplier.isPending;
  const supplierId = selectedSupplier?.supplier_id;

  const hasGeneralErrors = Boolean(
    errors.suppliers_legal_name ||
      errors.supplier_type ||
      errors.constitution_type ||
      errors.identification_type ||
      errors.identification_number ||
      errors.supplier_details?.contact_email ||
      errors.supplier_details?.email_support ||
      errors.supplier_details?.contact_phone_number,
  );

  const hasCommercialErrors = Boolean(
    errors.payment_methods ||
      errors.supplier_details?.preferred_payment_method ||
      errors.supplier_details?.credit_days ||
      errors.supplier_details?.credit_limit,
  );

  return useMemo(
    () => ({
      companyId,
      moduleCode,
      supplierId,
      isEditMode,
      activeTab,
      setActiveTab,
      handleTabChange,
      isSubmitting,
      isSupplierDetailsPending,
      hasGeneralErrors,
      hasCommercialErrors,
      control,
      register,
      handleSubmit,
      setValue,
      getValues,
      clearErrors,
      errors,
      trackField,
      trackDetailField,
      trackMultipleDetailFields,
      handleSupplier,
      handleClose,
      productLinks,
      handleProductLinksChange,
      currentBankAccounts,
      setLocalBankAccounts,
      CreateBankAccount,
      UpdateBankAccount,
      DeleteBankAccount,
      getMappedError,
      isSelectProductOpen,
      setIsSelectProductOpen,
      openProductPicker,
      closeProductPicker,
      handleSelectProducts,
      assignedProductIds,
      onRequestSuccess,
      onRequestError,
    }),
    [
      companyId,
      moduleCode,
      supplierId,
      isEditMode,
      activeTab,
      handleTabChange,
      isSubmitting,
      isSupplierDetailsPending,
      hasGeneralErrors,
      hasCommercialErrors,
      control,
      register,
      handleSubmit,
      setValue,
      getValues,
      clearErrors,
      errors,
      trackField,
      trackDetailField,
      trackMultipleDetailFields,
      handleSupplier,
      handleClose,
      productLinks,
      handleProductLinksChange,
      currentBankAccounts,
      CreateBankAccount,
      UpdateBankAccount,
      DeleteBankAccount,
      getMappedError,
      isSelectProductOpen,
      openProductPicker,
      closeProductPicker,
      handleSelectProducts,
      assignedProductIds,
      onRequestSuccess,
      onRequestError,
    ],
  );
};
