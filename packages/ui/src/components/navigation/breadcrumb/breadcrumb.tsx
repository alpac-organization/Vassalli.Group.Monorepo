import { Fragment } from "react";
import type { BreadcrumbProps } from "./breadcrumb.type";

export const Breadcrumb = function (props: BreadcrumbProps): React.ReactElement {
    const { items } = props;

    return (
        <Fragment>
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 m-0! p-0!">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={item.label + index} className="flex items-center">
                                {index > 0 && (
                                    <svg
                                        className="w-3 h-3 mx-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                )}

                                {isLast ? (
                                    <span className="ms-1! text-[13px]! cursor-pointer font-medium md:ms-2! dark:text-gray-300!">
                                        {item.label}
                                    </span>
                                ) : (
                                    <a
                                        onClick={(evt) => {
                                            evt.preventDefault()
                                            item.onClick?.(item.url)
                                        }}
                                        className="cursor-pointer 
                                                    inline-flex 
                                                    items-center 
                                                    text-[13px]! 
                                                    font-medium 
                                                    underline!
                                                    underline-offset-1!
                                                    text-white!
                                                    hover:text-blue-600!
                                                    dark:text-white! 
                                                    dark:hover:text-white!"
                                    >
                                        {index === 0 && (
                                            <svg className="w-3 h-3 me-2.5 -translate-y-[0.03em]!" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                            </svg>
                                        )}
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </Fragment>
    )
}
