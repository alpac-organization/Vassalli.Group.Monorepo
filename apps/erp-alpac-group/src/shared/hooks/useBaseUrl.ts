import { useMemo } from "react";
import { useParams } from "react-router-dom";

export const useBaseUrl = () => {

    const { alias_company } = useParams<{ alias_company: string }>();

    const baseUrl = useMemo(() => {
        return alias_company != null && alias_company !== "" ?
            `/${alias_company}/dashboard` : `/dashboard`;
    }, [alias_company])

    return { baseUrl }
}