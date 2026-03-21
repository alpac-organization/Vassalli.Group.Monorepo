import { createContext, useContext, useEffect, useState } from "react";

interface CompanyContextType {
    companyId: string | null;
    setCompanyId: (id: string | null) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {

    const [companyId, setCompanyId] = useState<string | null>(() => {
        return localStorage.getItem("selectedCompanyId") || null;
    });

    useEffect(() => {
        if (companyId) {
            localStorage.setItem("selectedCompanyId", companyId);
        } else {
            localStorage.removeItem("selectedCompanyId");
        }
    }, [companyId]);


    return (
        <CompanyContext.Provider value={{ companyId, setCompanyId }}>
            {children}
        </CompanyContext.Provider>
    );
};

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error("useCompany must be used within a CompanyProvider");
    }
    return context;
};