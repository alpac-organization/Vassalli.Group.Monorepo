export interface UserProps {
    access_token: string;
    refresh_token: string;
    user_name: string;
    company_information: {
        company_id: number;
        company_name: string;
        image_url: string | null;
    };
}