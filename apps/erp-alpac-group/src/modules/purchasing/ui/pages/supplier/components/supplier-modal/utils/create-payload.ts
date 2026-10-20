
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
import type { UpdateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/update-suppliers-request";
import type { CreateSupplierBankAccountPayload } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-bank-account";
import { hasConstitutionData } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/mappers/supplier-modal.mapper";
import {
  mapCatalogLinkItemsToTierPayload,
  resolveLinkCurrency,
  resolveLinkCurrencyPayload,
  resolveLinkUnitMeasureId,
  type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";

// Esta función toma un array de enlaces de productos del formulario y los transforma en el formato esperado para el payload,
// se filtran los elements válidos y mapea las properties necesarias aqui.
export const mapProductLinksToPayload = (links: CatalogLinkItemForm[]) =>
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

type BuildCreatePayloadArgs = {
  data: CreateSupplierRequest;
  companyId: string;
  moduleCode: string;
  localBankAccounts: CreateSupplierBankAccountPayload[];
  productLinks: CatalogLinkItemForm[];
};

// aqui construye el payload necesario para crear un proveedor, mapeando y ajustando los datos del formulario en el contract  por la API.
export const buildCreatePayload = ({
  data,
  companyId,
  moduleCode,
  localBankAccounts,
  productLinks,
}: BuildCreatePayloadArgs): CreateSupplierRequest => {
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

type BuildUpdatePayloadArgs = {
  companyId: string;
  moduleCode: string;
  supplierId: string;
  updateData: Partial<UpdateSupplierRequest>;
  productLinks: CatalogLinkItemForm[];
  productLinksDirty: boolean;
  formPreferredPaymentMethod: PaymentMethodType | null;
};

// aqui construye el payload necesario para actualizar un proveedor, de acuerdo al contract de la API.
export const buildUpdatePayload = ({
  companyId,
  moduleCode,
  supplierId,
  updateData,
  productLinks,
  productLinksDirty,
  formPreferredPaymentMethod,
}: BuildUpdatePayloadArgs): {
  payload: UpdateSupplierRequest;
  skippedEmptyProducts: boolean;
} => {
  const payload: UpdateSupplierRequest = {
    company_id: companyId,
    module_code: moduleCode,
    supplier_id: supplierId,
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
      formPreferredPaymentMethod;
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