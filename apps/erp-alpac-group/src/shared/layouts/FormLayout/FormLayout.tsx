import './FormLayout.css'

export type FormLayoutProps = {
    title?: string,
    children: React.ReactNode,
}

export const FormLayout = ({ title, children }: FormLayoutProps) => {
    return (
        <div className="form-layout-container">
            <div className="form-layout-box">
                {title && <h2 className="form-layout-title">{title}</h2>}
                <div className="form-layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
}