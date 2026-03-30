import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  fullName: string;
  email: string;
  userName: string;
  identificationNumber: string;
  companyId: string;
  companyName: string;
  companyAlias: string;
  moduleCode: string;
}

export const useUserStore = create<UserState>()(
  persist(
    () => ({
      fullName: "",
      email: "",
      userName: "",
      identificationNumber: "",
      companyId: "",
      companyName: "",
      companyAlias: "",
      moduleCode: "",
    }),
    {
      name: "user-data",
    },
  ),
);
