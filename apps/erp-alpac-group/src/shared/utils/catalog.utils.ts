import type { CatalogResponse } from "@app/modules/catalog/domain/ApiContract/Responses/catalog.response";

export const mapCatalogToOptions = (catalog: CatalogResponse[]) => {
  return catalog.map((item) => ({
    label: item.catalog_name,
    value: item.sub_catalog_id,
  }));
};
