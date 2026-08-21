export interface SectionResponse {
  section_id: string;
  section_code: string | null;
  section_name: string | null;
  section_type: string | number | null;
  storage_type: string | number | null;
  is_active: boolean;
}

export interface GetSectionsResponse {
  data: SectionResponse[];
  page_number: number;
  page_size: number;
  total: number;
}
