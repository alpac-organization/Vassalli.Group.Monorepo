
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const useParams = () => {
   const [searchParams, setSearchParams] = useSearchParams();

   const getParam = useCallback(
      (key: string) => searchParams.get(key),
      [searchParams]
   );

   const setParam = useCallback(
      (key: string, value: string, replace = true) => {
         setSearchParams(
            (prev) => {
               const next = new URLSearchParams(prev);
               next.set(key, value);
               return next;
            },
            { replace }
         );
      },
      [setSearchParams]
   );

   const removeParam = useCallback(
      (key: string, replace = true) => {
         setSearchParams(
            (prev) => {
               const next = new URLSearchParams(prev);
               next.delete(key);
               return next;
            },
            { replace }
         );
      },
      [setSearchParams]
   );

   return {
      searchParams,
      getParam,
      setParam,
      removeParam,
   };
};
