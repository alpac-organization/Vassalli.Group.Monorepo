import { Navigate, Outlet, useParams } from "react-router-dom";

export const AuthGuard = () => {
    const { company_id } = useParams();
    const token = localStorage.getItem("accessToken");


    if (!token) {
        return <Navigate to={`/${company_id}/auth`} replace />;
    }
    return <Outlet />;
};