import './form-layout.css'

export type FormLayoutProps = {
    title?: string,
    children: React.ReactNode,
}

export const FormLayout = ({ title, children }: FormLayoutProps) => {
    return (
        <div className="form-layout-container dark:bg-[#181818] dark:text-white">
            <div className="form-layout-box dark:bg-[#202020]">
                {title && <h2 className="form-layout-title">{title}</h2>}
                <div className="form-layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
}