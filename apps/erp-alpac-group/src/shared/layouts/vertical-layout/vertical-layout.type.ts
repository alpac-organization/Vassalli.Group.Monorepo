import type { ReactNode } from "react";

export interface VerticalLayoutProps {
    children: ReactNode;
    className?: string;
    gap?: number | string;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    fullHeight?: boolean;
    fullWidth?: boolean;
}
