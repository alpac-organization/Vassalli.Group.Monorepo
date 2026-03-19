import React from "react";
import type { HorizontalLayoutProps } from "./horizontal-layout.type";
import "./horizontal-layout.css";

export const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({
    children,
    className = "",
    gap = 0,
    align = "center",
    justify = "start",
    fullWidth = true,
    wrap = false,
}) => {
    const alignmentClasses = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
        baseline: "items-baseline",
    };

    const justificationClasses = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
    };

    const classes = [
        "horizontal-layout",
        alignmentClasses[align],
        justificationClasses[justify],
        fullWidth ? "horizontal-layout--full-width" : "",
        wrap ? "horizontal-layout--wrap" : "",
        className,
    ].filter(Boolean).join(" ");

    return (
        <div
            className={classes}
            style={{ gap: typeof gap === "number" ? `${gap}px` : gap }}
        >
            {children}
        </div>
    );
};
