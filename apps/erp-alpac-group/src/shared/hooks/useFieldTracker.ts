import { useCallback, useState } from "react";

export function useFieldTracker<T extends object>(initialData: T) {
	const [updateData, setUpdateData] = useState<Partial<T>>({});

	const updateFiledTracker = useCallback(
		<K extends keyof T>(field: K, value: T[K]) => {
			if (initialData[field] === value) {
				setUpdateData((prev) => {
					const next = { ...prev };
					delete next[field];
					return next;
				});
				return;
			}

			setUpdateData((prev) => ({ ...prev, [field]: value }));
		},
		[initialData],
	);

	const resetFieldTracker = useCallback(() => {
		setUpdateData({});
	}, []);

	return {
		updateData,
		updateFiledTracker,
		resetFieldTracker,
	};
}
