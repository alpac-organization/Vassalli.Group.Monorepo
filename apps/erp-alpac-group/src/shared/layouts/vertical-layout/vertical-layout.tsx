import React from "react";
import type { VerticalLayoutProps } from "./vertical-layout.type";
import "./vertical-layout.css";

export const VerticalLayout: React.FC<VerticalLayoutProps> = ({
    children,
    className = "",
    gap = 0,
    align = "stretch",
    justify = "start",
    fullHeight = false,
    fullWidth = true,
}) => {
    const alignmentClasses = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
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
        "vertical-layout",
        alignmentClasses[align],
        justificationClasses[justify],
        fullHeight ? "vertical-layout--full-height" : "",
        fullWidth ? "vertical-layout--full-width" : "",
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
