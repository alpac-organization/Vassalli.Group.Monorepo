import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  fullName: string;
  email: string;
  userName: string;
  identificationNumber: string;
  companyId: string;
  companyName: string;
  companyAlias: string;
  moduleCode: string;
  userType: string;
  role: string;
  moduleBasePath: string;
  areaId: string;
  branchId: string;
  costCenterId: string;
  costCenterName: string;
  costCenterCode: string;
}

const initialUserState: UserState = {
  fullName: '',
  email: '',
  userName: '',
  identificationNumber: '',
  companyId: '',
  companyName: '',
  companyAlias: '',
  moduleCode: '',
  userType: '',
  role: '',
  moduleBasePath: '',
  areaId: '',
  branchId: '',
  costCenterId: '',
  costCenterName: '',
  costCenterCode: '',
};

export const useUserStore = create<UserState>()(
  persist(
    () => ({ ...initialUserState }),
    {
      name: 'user-data',
    },
  ),
);

export const clearUserStore = () => {
  useUserStore.setState({ ...initialUserState });
  void useUserStore.persist.clearStorage();
};
