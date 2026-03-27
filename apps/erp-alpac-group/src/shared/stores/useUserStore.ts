import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    fullName: string;
    email: string;
    userName: string;
    companyId: string;
    companyName: string;
    companyAlias: string;
}

export const useUserStore = create<UserState>()(
    persist(() => ({
        fullName: "",
        email: "",
        userName: "",
        companyId: "",
        companyName: "",
        companyAlias: ""
    }), {
        name: "user-data",
    })
)