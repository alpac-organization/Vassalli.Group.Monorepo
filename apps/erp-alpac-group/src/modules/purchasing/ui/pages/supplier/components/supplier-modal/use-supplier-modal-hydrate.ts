import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { UseFormReset } from "react-hook-form";
import { httpHandler } from "@app/core/adapters";
import { SupplierExclusiveStatusEnum } from "@app/core/enums/supplier-exclusive-status.enum";
import {
  resolveSupplierType,
  SupplierTypeEnum,
} from "@app/core/enums/supplier-type.enum";
import type { CreateSupplierRequest } from "@app/modules/purchasing/domain/ApiContract/Requests/supplier/create-supplier-request";
import type { GetSupplierDetailsResponse } from "@app/modules/purchasing/domain/ApiContract/Responses/supplier/get-supplier-details-response";
import type { SupplierLinkedProduct } from "@app/modules/purchasing/domain/ApiContract/shared/supplier/supplier-product";
import { SupplierServices } from "@app/modules/purchasing/infrastructure/services/supplier/SupplierServices";
import {
  hasConstitutionData,
  mapSupplierPaymentMethods,
  resolveConstitutionType,
  resolveIdentificationType,
} from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.mappers";
import type { SupplierModalProps } from "@app/modules/purchasing/ui/pages/supplier/components/supplier-modal/supplier-modal.types";
import {
  mapTierPricesToCatalogForm,
  resolveLinkCurrency,
  type CatalogLinkItemForm,
} from "@app/modules/product/ui/components/catalog-link-editor/catalog-link-editor.types";
import { readPagedRows } from "@app/shared/utils/paged-response.utils";
import { formatPhone } from "@app/shared/utils/string.utils";

const suppliersCatalogService = new SupplierServices(httpHandler);

type UseSupplierModalHydrateArgs = {
  isOpen: boolean;
  selectedSupplier: SupplierModalProps["selectedSupplier"];
  supplierDetails: GetSupplierDetailsResponse | undefined;
  companyId: string;
  moduleCode: string;
  reset: UseFormReset<CreateSupplierRequest>;
  resetTracker: () => void;
  setProductLinks: Dispatch<SetStateAction<CatalogLinkItemForm[]>>;
  setProductLinksDirty: Dispatch<SetStateAction<boolean>>;
  setCatalogFullyLoaded: Dispatch<SetStateAction<boolean>>;
};

export function useSupplierModalHydrate({
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
}: UseSupplierModalHydrateArgs) {
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
      resetTracker();
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
    resetTracker,
    setProductLinks,
    setProductLinksDirty,
    setCatalogFullyLoaded,
  ]);
}
