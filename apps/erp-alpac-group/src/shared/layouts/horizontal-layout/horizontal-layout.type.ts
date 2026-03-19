import type { ReactNode } from "react";

export interface HorizontalLayoutProps {
    children: ReactNode;
    className?: string;
    gap?: number | string;
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    fullWidth?: boolean;
    wrap?: boolean;
}
