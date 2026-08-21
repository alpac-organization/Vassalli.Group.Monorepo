export interface SectionResponse {
  section_id: string;
  section_code: string;
  section_name: string;
  section_type: string | null;
  storage_type: string | null;
  is_active: boolean;
}
