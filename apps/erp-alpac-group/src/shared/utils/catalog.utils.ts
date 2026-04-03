import type { CatalogResponse } from '@app/modules/catalog/domain/ApiContract/Responses/catalog.response';

export const mapCatalogToOptions = (
  catalog: CatalogResponse[],
): { label: string; value: number }[] => {
  if (!Array.isArray(catalog)) return [];
  return catalog.map((item) => ({
    label: item.catalog_name,
    value: item.sub_catalog_id,
  }));
};
