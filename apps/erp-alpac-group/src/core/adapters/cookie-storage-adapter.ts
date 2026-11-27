import Cookies from "js-cookie";

const STORAGE_KEYS = {
   ACCESS_TOKEN: 'erp_access_token',
   REFRESH_TOKEN: 'erp_refresh_token',
   COMPANY_ALIAS: 'company-data',
   USER_DATA: 'user-data'
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

const COOKIE_PATH = '/';

const isSecureCookieContext = (): boolean =>
   typeof window !== 'undefined' && window.location.protocol === 'https:';

export const CookieStorageAdapter = {
   private_save: (key: StorageKey, value: string, expires: number) => {
      Cookies.set(key, value, {
         expires,
         secure: isSecureCookieContext(),
         sameSite: 'strict',
         path: COOKIE_PATH
      });
   },

   setToken: (token: string) => 
      CookieStorageAdapter.private_save(STORAGE_KEYS.ACCESS_TOKEN, token, 1),
   
   getToken: () => 
      Cookies.get(STORAGE_KEYS.ACCESS_TOKEN),
   
   removeToken: () => 
      Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN, { path: COOKIE_PATH }),

   setRefreshToken: 
      (token: string) => CookieStorageAdapter.private_save(STORAGE_KEYS.REFRESH_TOKEN, token, 7),
   
   getRefreshToken: () => 
      Cookies.get(STORAGE_KEYS.REFRESH_TOKEN),
   
   removeRefreshToken: () => 
      Cookies.remove(STORAGE_KEYS.REFRESH_TOKEN, { path: COOKIE_PATH }),

   setCompanyAlias: (alias: string) => 
      CookieStorageAdapter.private_save(STORAGE_KEYS.COMPANY_ALIAS, alias, 7),
   
   getCompanyAlias: () => 
      Cookies.get(STORAGE_KEYS.COMPANY_ALIAS),
   
   removeCompanyAlias: () => 
      Cookies.remove(STORAGE_KEYS.COMPANY_ALIAS, { path: COOKIE_PATH }),
   
   
   getUserData: () => 
      Cookies.get(STORAGE_KEYS.USER_DATA),
   
   removeUserData: () => 
      Cookies.remove(STORAGE_KEYS.USER_DATA, { path: COOKIE_PATH }),

   hasSession: () => {
      const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
      const alias = Cookies.get(STORAGE_KEYS.COMPANY_ALIAS);
      return !!(token && alias);
   },

   clearAuth: () => {
      Object.values(STORAGE_KEYS).forEach(key => Cookies.remove(key, { path: COOKIE_PATH }));
   },
};