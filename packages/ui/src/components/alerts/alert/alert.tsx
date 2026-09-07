import { Fragment, useState } from "react";
import { AlertProps } from "./alert.types";

export function Alert(props: AlertProps): React.ReactElement | null {

    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const alertStyleByTypes = {
        success: "bg-green-50 text-green-800 border-green-400",
        error: "bg-red-50 text-red-800 border-red-400",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-500",
        info: "bg-blue-50 text-blue-800 border-blue-500"
    }

    const type = alertStyleByTypes[props.type || "info"]

    const alertIconsByDefault: Record<AlertProps["type"], React.ReactNode> = {
        success: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        error: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6" />
        </svg>,
        warning: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z" />
        </svg>,
        info: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    }

    const icon = props.icon || alertIconsByDefault[props.type || "info"]

    const handleClose = (evt: React.MouseEvent<HTMLButtonElement>) => {
        setIsVisible(false);
        if (props.onClose) props.onClose(evt);
    }

    return (
        <Fragment>
            <div
                className={`p-4 border rounded-lg relative ${type}`}
                role="alert">

                {props.showCloseButton && (
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                        className="absolute right-2 top-2 rounded-full hover:bg-black/10 opacity-70 hover:opacity-100 transition-all focus:ring-2 inline-flex items-center justify-center h-6 w-6 shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {icon && (
                            <div className="mr-3 flex items-center justify-center">
                                {icon}
                            </div>
                        )}
                        <span className="sr-only">{props.type}</span>
                        {
                            props.title && (
                                <h3 className="text-[16px]! font-semibold m-0! p-0!">{props.title}</h3>
                            )
                        }
                    </div>
                </div>

                <div className="mt-1 text-[15px]! font-medium">
                    {props.message}
                </div>
            </div>
        </Fragment>
    )
}
