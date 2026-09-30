import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyState {
  urlImage: string;
  neutralUrlImage: string;
}

const initialCompanyState: CompanyState = {
  urlImage: '',
  neutralUrlImage: '',
};

export const useCompanyStore = create<CompanyState>()(
  persist(
    () => ({ ...initialCompanyState }),
    {
      name: 'company-data',
    },
  ),
);

export const clearCompanyStore = () => {
  useCompanyStore.setState({ ...initialCompanyState });
  void useCompanyStore.persist.clearStorage();
};
