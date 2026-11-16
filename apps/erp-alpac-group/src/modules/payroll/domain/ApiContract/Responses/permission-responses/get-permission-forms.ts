export interface CatalogItem {
  value: number;
  name: string;
  label: string;
}

export interface PermissionFormsOptions {
  permit_types: CatalogItem[];
  beneficiary_scopes: CatalogItem[];
  family_relationships: CatalogItem[];
}
