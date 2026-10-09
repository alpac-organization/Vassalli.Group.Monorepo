export type PagedListLike<T> = {
	data?: T[];
	items?: T[];
	total?: number;
	total_count?: number;
	page_number?: number;
	page_size?: number;
};

export function readPagedRows<T>(page?: PagedListLike<T> | null): {
	rows: T[];
	total: number;
} {
	return {
		rows: page?.data ?? page?.items ?? [],
		total: page?.total ?? page?.total_count ?? 0,
	};
}

export function normalizePagedList<T>(
	page?: PagedListLike<T> | null,
): { data: T[]; page_number: number; page_size: number; total: number } | undefined {
	if (!page) return undefined;

	const { rows, total } = readPagedRows(page);
	return {
		data: rows,
		page_number: page.page_number ?? 1,
		page_size: page.page_size ?? rows.length,
		total,
	};
}
