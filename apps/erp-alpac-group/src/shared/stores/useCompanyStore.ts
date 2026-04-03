import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  urlImage: string;
  neutralUrlImage: string;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    () => ({
      urlImage: '',
      neutralUrlImage: '',
    }),
    {
      name: 'company-data',
    },
  ),
);
