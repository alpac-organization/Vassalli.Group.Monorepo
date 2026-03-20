import { Navigate, Outlet, useParams } from "react-router-dom";
import { useCompany } from "../providers/company-provider";

export const CompanyGuard = function () {

    const { companyId } = useCompany();
    const { company_id: urlCompanyId } = useParams()

    if (!companyId) {
        return <Navigate to="/" replace />;
    }

    if (urlCompanyId !== companyId) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}