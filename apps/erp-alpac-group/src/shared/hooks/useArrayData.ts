import { useMemo } from "react";

export const useArrayData = <T,>(data: unknown): T[] =>
	useMemo(() => (Array.isArray(data) ? (data as T[]) : []), [data]);