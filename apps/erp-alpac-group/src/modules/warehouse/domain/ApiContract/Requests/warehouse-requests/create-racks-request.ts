export interface RackLevelSpecRequest {
	level_number: number;
	racks_count: number;
	width_metres: number;
	length_metres: number;
	height_metres?: number | null;
	usage_profile: string;
	max_pulleys: number;
	status: string;
	unavailable_reason?: string | null;
}

export interface CreateRacksRequest {
	company_id: string;
	module_code: string;
	section_id: string;
	shelf_code?: string | null;
	starting_deposit_number?: number | null;
	levels: RackLevelSpecRequest[];
}