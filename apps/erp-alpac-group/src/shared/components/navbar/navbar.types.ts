export interface NavbarProps {
    user_name: string;
    email: string;
    urlImage: string;
    isSettingPage: boolean;
    onLogout: () => void;
}