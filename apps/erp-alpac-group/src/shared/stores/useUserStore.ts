import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
    fullName: string;
    email: string;
    userName: string;
    companyName: string;
}

export const useUserStore = create<UserState>()(
    persist(() => ({
        fullName: "",
        email: "",
        userName: "",
        companyName: "",
    }), {
        name: "user-data",
    })
)