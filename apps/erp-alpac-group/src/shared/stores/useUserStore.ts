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
}

export const useUserStore = create<UserState>()(
  persist(
    () => ({
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
      branchId: ''
    }),
    {
      name: 'user-data',
    },
  ),
);
