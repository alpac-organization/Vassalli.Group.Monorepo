import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { httpHandler } from "@app/core/adapters";
import type { CurrencyCode } from "@app/core/enums/currency.enum";
import type { PaymentMethodType } from "@app/core/enums/payment-method.enum";
import {
  SupplierExclusiveStatusEnum,
  type SupplierExclusiveStatusOnCreate,
} from "@app/core/enums/supplier-exclusive-status.enum";
import {
  resolveSupplierType,
  SupplierTypeEnum,
} from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type {
  UpdateSupplierDetailsPayload,
  UpdateSupplierRequest,
} from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { GetProductResponse } from "@app/modules/product/domain/ApiContract/Responses/product/get-product.response";
import type { CreateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import { useSupplierEditor } from "@app/modules/purchasing/ui/hooks/supplier/useSupplier";
import {
  emptyFormValues,
  hasConstitutionData,
  mapSupplierPaymentMethods,
  resolveConstitutionType,
  resolveIdentificationType,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.mappers";
import type {
  CreatedSupplierDto,
  SupplierModalProps,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import {
  mapCatalogLinkItemsToTierPayload,
  mapTierPricesToCatalogForm,
  resolveLinkCurrency,
  resolveLinkCurrencyPayload,
  resolveLinkUnitMeasureId,
  validateCatalogLinkPreferentialDates,
  type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { useFieldTracker } from "@app/shared/hooks/useFieldTracker";
import { useMappedError } from "@app/shared/hooks/useMappedError";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { readPagedRows } from "@app/shared/utils/paged-response.utils";
import { formatPhone } from "@app/shared/utils/string.utils";

export type SupplierModalTab = "general" | "commercial" | "bank_accounts" | "products";

const suppliersCatalogService = new SupplierServices(httpHandler);

const mapProductLinksToPayload = (links: CatalogLinkItemForm[]) =>
  links
    .filter((link) => link.entity_id && link.unit_price.trim())
    .map((link) => ({
      product_id: link.entity_id,
      unit_price: Number(link.unit_price),
      currency: resolveLinkCurrencyPayload(link.currency),
      unit_measure_id: resolveLinkUnitMeasureId(link.unit_measure_id),
      tier_prices: mapCatalogLinkItemsToTierPayload(
        link.tier_prices,
        link.currency,
        link.unit_measure_id,
      ),
    }));

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

  const { updateData, updateFiledTracker, resetFieldTracker } =
    useFieldTracker<UpdateSupplierRequest>(trackerInitial);

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

  const trackField = useCallback(
    <K extends keyof UpdateSupplierRequest>(
      field: K,
      value: UpdateSupplierRequest[K],
    ) => {
      if (!isEditMode) return;
      updateFiledTracker(field, value);
    },
    [isEditMode, updateFiledTracker],
  );

  const trackDetailField = useCallback(
    <K extends keyof UpdateSupplierDetailsPayload>(
      field: K,
      value: UpdateSupplierDetailsPayload[K],
    ) => {
      if (!isEditMode) return;

      const initialValue = trackerInitial.supplier_details?.[field];
      const current: UpdateSupplierDetailsPayload = {
        ...(updateData.supplier_details ?? {}),
      };

      if (initialValue === value) {
        delete current[field];
      } else {
        current[field] = value;
      }

      updateFiledTracker(
        "supplier_details",
        Object.keys(current).length === 0
          ? trackerInitial.supplier_details
          : current,
      );
    },
    [isEditMode, trackerInitial, updateData.supplier_details, updateFiledTracker],
  );

  const trackMultipleDetailFields = useCallback(
    (changes: UpdateSupplierDetailsPayload) => {
      if (!isEditMode) return;

      const initial = trackerInitial.supplier_details ?? {};
      const current: UpdateSupplierDetailsPayload = {
        ...(updateData.supplier_details ?? {}),
      };

      (Object.keys(changes) as (keyof UpdateSupplierDetailsPayload)[]).forEach(
        (key) => {
          const val = changes[key];
          if (initial[key] === val) {
            delete current[key];
          } else {
            current[key] = val as never;
          }
        },
      );

      updateFiledTracker(
        "supplier_details",
        Object.keys(current).length === 0
          ? trackerInitial.supplier_details
          : current,
      );
    },
    [isEditMode, trackerInitial, updateData.supplier_details, updateFiledTracker],
  );

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
    resetFieldTracker();
    setLocalBankAccounts([]);
    setProductLinks([]);
    setProductLinksDirty(false);
    setCatalogFullyLoaded(true);
    setIsSelectProductOpen(false);
    setActiveTab("general");
  }, [reset, resetFieldTracker]);

  const handleClose = useCallback(() => {
    resetSession();
    onClose();
  }, [onClose, resetSession]);

  const buildCreatePayload = (
    data: CreateSupplierRequest,
  ): CreateSupplierRequest => {
    const {
      constitution_type,
      identification_type,
      identification_number,
      supplier_details,
      ...rest
    } = data;

    const hasCreditVal = Boolean(supplier_details?.has_credit);
    const exclusiveStatus: SupplierExclusiveStatusOnCreate =
      supplier_details?.exclusive_status ===
      SupplierExclusiveStatusEnum.PendingReview.stringValue
        ? SupplierExclusiveStatusEnum.PendingReview.stringValue
        : SupplierExclusiveStatusEnum.None.stringValue;
    const hasExclusiveStatus =
      exclusiveStatus !== SupplierExclusiveStatusEnum.None.stringValue;

    const paymentMethods = (data.payment_methods ?? []).filter(Boolean);
    const resolvedSupplierType =
      resolveSupplierType(data.supplier_type) ??
      SupplierTypeEnum.Ordinary.stringValue;
    const supplierDefaultCurrency: CurrencyCode = resolveLinkCurrency(
      supplier_details?.currency ??
        (hasCreditVal ? supplier_details?.credit_currency : null) ??
        "NIO",
    );

    const payload: CreateSupplierRequest = {
      ...rest,
      company_id: companyId,
      module_code: moduleCode,
      commercial_name: data.commercial_name?.trim() || null,
      supplier_type: resolvedSupplierType,
      payment_methods: paymentMethods,
      supplier_details: {
        ...supplier_details,
        has_credit: hasCreditVal,
        credit_days: hasCreditVal
          ? Number(supplier_details?.credit_days) || 0
          : 0,
        credit_limit:
          hasCreditVal && supplier_details?.credit_limit != null
            ? Number(supplier_details.credit_limit)
            : null,
        credit_currency: hasCreditVal
          ? supplier_details?.credit_currency || "USD"
          : null,
        alert_days_before_due: hasCreditVal
          ? Number(supplier_details?.alert_days_before_due) || 0
          : 0,
        exclusive_status: exclusiveStatus,
        exclusive_brands_or_parts: hasExclusiveStatus
          ? supplier_details?.exclusive_brands_or_parts?.trim() || null
          : null,
        supplier_type: resolvedSupplierType,
        currency: supplierDefaultCurrency,
        apply_ir_retention: Boolean(supplier_details?.apply_ir_retention),
        apply_municipal_retention: Boolean(
          supplier_details?.apply_municipal_retention,
        ),
        is_tax_exempt: Boolean(supplier_details?.is_tax_exempt),
        preferred_payment_method:
          supplier_details?.preferred_payment_method &&
          paymentMethods.includes(supplier_details.preferred_payment_method)
            ? supplier_details.preferred_payment_method
            : (paymentMethods[0] ?? null),
      },
      bank_accounts:
        localBankAccounts.length > 0 ? localBankAccounts : undefined,
      products:
        productLinks.length > 0
          ? mapProductLinksToPayload(productLinks)
          : undefined,
    };

    if (hasConstitutionData(constitution_type)) {
      payload.constitution_type = constitution_type;
      payload.identification_type = identification_type;
      payload.identification_number = identification_number;
    }

    return payload;
  };

  const buildUpdatePayload = (): {
    payload: UpdateSupplierRequest;
    skippedEmptyProducts: boolean;
  } => {
    const payload: UpdateSupplierRequest = {
      company_id: companyId,
      module_code: moduleCode,
      supplier_id: selectedSupplier!.supplier_id,
      ...updateData,
    };

    if (payload.supplier_type) {
      const resolvedType =
        resolveSupplierType(payload.supplier_type) ?? payload.supplier_type;
      payload.supplier_type = resolvedType;
      payload.supplier_details = {
        ...(payload.supplier_details ?? {}),
        supplier_type: resolvedType,
      };
    }

    if (payload.supplier_details) {
      const details = { ...payload.supplier_details } as Record<string, unknown>;
      delete details.exclusive_status;
      delete details.exclusive_status_comments;
      payload.supplier_details =
        details as UpdateSupplierRequest["supplier_details"];
    }

    if (payload.payment_methods) {
      const methods = payload.payment_methods.filter(Boolean);
      payload.payment_methods = methods;
      const currentPreferred =
        payload.supplier_details?.preferred_payment_method ??
        (getValues(
          "supplier_details.preferred_payment_method",
        ) as PaymentMethodType | null);
      const resolvedPreferred =
        currentPreferred && methods.includes(currentPreferred)
          ? currentPreferred
          : (methods[0] ?? undefined);

      if (resolvedPreferred) {
        payload.supplier_details = {
          ...(payload.supplier_details ?? {}),
          preferred_payment_method: resolvedPreferred,
        };
      } else if (payload.supplier_details) {
        const restDetails = { ...payload.supplier_details };
        delete restDetails.preferred_payment_method;
        payload.supplier_details =
          Object.keys(restDetails).length > 0 ? restDetails : undefined;
      }
    }

    if (
      payload.supplier_details &&
      Object.keys(payload.supplier_details).length === 0
    ) {
      delete payload.supplier_details;
    }

    let skippedEmptyProducts = false;
    if (productLinksDirty) {
      const mappedProducts = mapProductLinksToPayload(productLinks);
      if (mappedProducts.length > 0) {
        payload.products = mappedProducts;
      } else {
        skippedEmptyProducts = true;
      }
    }

    return { payload, skippedEmptyProducts };
  };

  const handleCreateSupplier = (data: CreateSupplierRequest) => {
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

    const payload = buildCreatePayload(data);

    CreateSupplier.mutate(payload, {
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
  };

  const handleUpdateSupplier = () => {
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

    const { payload, skippedEmptyProducts } = buildUpdatePayload();

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

    UpdateSupplier.mutate(payload, {
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
  };

  const handleSupplier = (data: CreateSupplierRequest) => {
    if (isEditMode) {
      handleUpdateSupplier();
      return;
    }
    handleCreateSupplier(data);
  };

  useEffect(() => {
    if (!isOpen || !selectedSupplier || !supplierDetails) return;

    let cancelled = false;

    const mapLinkedProducts = (
      rows: SupplierLinkedProduct[],
    ): CatalogLinkItemForm[] =>
      rows.map((product) => ({
        entity_id: product.product_id,
        entity_label: product.code
          ? `${product.code} · ${product.product_name}`
          : product.product_name,
        unit_price: String(product.unit_price ?? ""),
        currency: resolveLinkCurrency(product.currency),
        unit_measure_id: product.unit_measure_id ?? "",
        tier_prices: mapTierPricesToCatalogForm(
          product.tier_prices,
          product.currency,
        ),
      }));

    const hydrate = async () => {
      const constitutionTypeValue = resolveConstitutionType(
        supplierDetails.constitution_type,
      );
      const hasConstitution = hasConstitutionData(constitutionTypeValue);
      const identificationTypeValue = resolveIdentificationType(
        supplierDetails.identification_type,
        supplierDetails.constitution_type,
      );

      const identificationNumber = hasConstitution
        ? String(supplierDetails.identification_number ?? "")
            .replace(/-/g, "")
            .toUpperCase()
        : "";

      const details = supplierDetails.supplier_details;
      const firstPage = readPagedRows(supplierDetails.products);
      let productRows = firstPage.rows;
      const total = firstPage.total;
      const pageSize = supplierDetails.products?.page_size ?? 100;

      setCatalogFullyLoaded(productRows.length >= total);

      if (productRows.length < total && selectedSupplier.supplier_id) {
        const totalPages = Math.ceil(total / pageSize);
        const remainingPages = await Promise.all(
          Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) =>
            suppliersCatalogService.GetSupplierDetails({
              company_id: companyId,
              module_code: moduleCode,
              supplier_id: selectedSupplier.supplier_id,
              page_number: index + 2,
              page_size: pageSize,
            }),
          ),
        );

        if (cancelled) return;

        const seen = new Set(productRows.map((row) => row.product_id));
        for (const page of remainingPages) {
          for (const row of readPagedRows(page.products).rows) {
            if (seen.has(row.product_id)) continue;
            seen.add(row.product_id);
            productRows = [...productRows, row];
          }
        }
      }

      if (cancelled) return;

      reset({
        suppliers_legal_name: supplierDetails.supplier_legal_name ?? "-",
        commercial_name: supplierDetails.commercial_name ?? "",
        constitution_type: constitutionTypeValue,
        identification_type: identificationTypeValue,
        identification_number: identificationNumber,
        supplier_type:
          resolveSupplierType(supplierDetails.supplier_type) ??
          SupplierTypeEnum.Ordinary.stringValue,
        payment_methods: mapSupplierPaymentMethods(
          supplierDetails.supplier_payment_methods,
        ),
        supplier_details: {
          credit_days: details?.credit_days ?? 0,
          has_credit: Boolean(details?.has_credit),
          exclusive_status:
            details?.exclusive_status ??
            supplierDetails.exclusive_status ??
            SupplierExclusiveStatusEnum.None.stringValue,
          exclusive_brands_or_parts: details?.exclusive_brands_or_parts ?? "",
          credit_limit: details?.credit_limit ?? null,
          credit_currency: details?.credit_currency ?? "USD",
          alert_days_before_due: details?.alert_days_before_due ?? 5,
          apply_ir_retention: Boolean(details?.apply_ir_retention),
          apply_municipal_retention: Boolean(
            details?.apply_municipal_retention,
          ),
          is_tax_exempt: Boolean(details?.is_tax_exempt),
          preferred_payment_method: details?.preferred_payment_method ?? null,
          contact_name: details?.contact_name ?? "",
          contact_phone_number: details?.contact_phone_number
            ? formatPhone(details.contact_phone_number)
            : "",
          contact_email: details?.contact_email ?? "",
          email_support: details?.email_support ?? "",
          address: details?.address ?? "",
        },
      });
      setProductLinks(mapLinkedProducts(productRows));
      setProductLinksDirty(false);
      setCatalogFullyLoaded(true);
      resetFieldTracker();
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    selectedSupplier,
    supplierDetails,
    companyId,
    moduleCode,
    reset,
    resetFieldTracker,
  ]);

  const currentBankAccounts = isEditMode
    ? (supplierDetails?.bank_accounts ?? [])
    : localBankAccounts;

  const isSubmitting = CreateSupplier.isPending || UpdateSupplier.isPending;

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

  return {
    companyId,
    moduleCode,
    supplierId: selectedSupplier?.supplier_id,
    isEditMode,
    activeTab,
    setActiveTab,
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
    handleSelectProducts,
    assignedProductIds,
    onRequestSuccess,
    onRequestError,
  };
};
