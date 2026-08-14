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