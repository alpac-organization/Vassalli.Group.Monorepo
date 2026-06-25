import { useEffect, useState } from "react"

export type ThemeValues = 'light' | 'dark';

export const useTheme = function(){

   const [theme, setTheme] = useState<ThemeValues>(() => {
      if (typeof localStorage !== 'undefined') {
         return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
      }
      return 'light';
   });

   useEffect(() => {
      const root = document.documentElement;
      
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
         metaTheme = document.createElement('meta');
         metaTheme.setAttribute('name', 'theme-color');
         document.head.appendChild(metaTheme);
      }
      
      if (theme === 'dark') {
         root.setAttribute('data-theme', 'dark');
         localStorage.setItem('theme', 'dark');
         // metaTheme.setAttribute('content', '#0a0a0a'); // Color barra móvil oscuro
      }
      else {
         // 2. Cambiamos el atributo data-theme a "light"
         root.setAttribute('data-theme', 'light');
         localStorage.setItem('theme', 'light');
         // metaTheme.setAttribute('content', '#ffffff');
      }

   }, [theme]);

   const toggleTheme = () => {
      setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
   };

   return { theme, toggleTheme, isDark: theme === 'dark' };
}