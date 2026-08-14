export interface RackSummaryResponse {
	rack_id: string;
	code: string;
	level_number: number;
	row_number: number;
	status: string;
}

export interface RackSectionFilterResultResponse {
	section_id: string;
	total_racks_count: number;
	racks: RackSummaryResponse[];
}

export interface LevelCapacityResponse {
	level_number: number;
	racks_count: number;
	used_length_metres: number;
	available_length_metres: number;
}

export interface RegisterRacksResultResponse {
	section_id: string;
	section_length_metres: number;
	total_requested: number;
	total_created: number;
	level_capacity: LevelCapacityResponse[];
}

export interface RackPositionResponse {
	position_id: string;
	position_number: number;
	position_code: string;
	is_blocked: boolean;
	block_reason: string | null;
}

export interface RackDetailResponse {
	rack_id: string;
	section_id: string;
	code: string | null;
	width_metres: number;
	length_metres: number;
	height_metres: number | null;
	usage_profile: string | null;
	row_number: number;
	level_number: number;
	max_pulleys: number;
	status: string | null;
	unavailable_reason: string | null;
	status_changed_at: string | null;
	total_positions: number;
	occupied_positions: number;
	positions: RackPositionResponse[];
}