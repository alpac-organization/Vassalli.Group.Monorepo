import Cookies from "js-cookie";

const STORAGE_KEYS = {
   ACCESS_TOKEN: 'erp_access_token',
   REFRESH_TOKEN: 'erp_refresh_token',
   COMPANY_ALIAS: 'erp_company_alias'
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export const CookieStorageAdapter = {
   private_save: (key: StorageKey, value: string, expires: number) => {
      Cookies.set(key, value, {
         expires,
         secure: true,
         sameSite: 'strict',
         path: '/'
      });
   },

   setToken: (token: string) => 
      CookieStorageAdapter.private_save(STORAGE_KEYS.ACCESS_TOKEN, token, 1),
   
   getToken: () => 
      Cookies.get(STORAGE_KEYS.ACCESS_TOKEN),
   
   removeToken: () => 
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN),

   setRefreshToken: 
      (token: string) => CookieStorageAdapter.private_save(STORAGE_KEYS.REFRESH_TOKEN, token, 7),
   
   getRefreshToken: () => 
      Cookies.get(STORAGE_KEYS.REFRESH_TOKEN),
   
   removeRefreshToken: () => 
      Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN),

   setCompanyAlias: (alias: string) => 
      CookieStorageAdapter.private_save(STORAGE_KEYS.COMPANY_ALIAS, alias, 7),
   
   getCompanyAlias: () => 
      Cookies.get(STORAGE_KEYS.COMPANY_ALIAS),
   
   removeCompanyAlias: () => 
      Cookies.remove(STORAGE_KEYS.COMPANY_ALIAS),
   
   hasSession: () => {
      const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
      const alias = Cookies.get(STORAGE_KEYS.COMPANY_ALIAS);
      return !!(token && alias);
   },

   clearAuth: () => {
      Object.values(STORAGE_KEYS).forEach(key => Cookies.remove(key));
   },
};