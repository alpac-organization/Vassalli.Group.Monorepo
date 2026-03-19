import './form-layout.css'
import type { FormLayoutProps } from './form-layout.type';

export const FormLayout = ({ title, className, imageUrl, children }: FormLayoutProps) => {

    const baseClasses = `form-layout-container dark:bg-[#181818] dark:text-white`

    return (
        <div className={`${baseClasses} ${className}`}>
            <div className="form-layout-box dark:bg-[#202020]">
                {imageUrl && <img src={imageUrl} className="w-32 h-32 mx-auto mb-4" alt="Logo" />}
                {title && <h2 className="form-layout-title">{title}</h2>}
                <div className="form-layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
}