export interface RackListItemResponse {
  rack_id: string;
  code: string;
  level_number: number;
  row_number: number;
  status: string | null;
  usage_profile?: string | null;
}

export interface GetRackResponse {
  section_id: string;
  total_racks_count: number;
  racks: RackListItemResponse[];
}
