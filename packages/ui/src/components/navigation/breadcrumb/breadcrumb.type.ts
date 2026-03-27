export type BreadcrumbProps = {
    items: BreadcrumbItem[];
}

export type BreadcrumbItem = {
    label: string;
    url: string;
    onClick?: (url: string) => void;
}