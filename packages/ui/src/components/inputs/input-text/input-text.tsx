import { InputProps } from "./input-text.types";
import { forwardRef, useState } from "react";

export const InputText = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, isPassword, type,...rest }, ref) => {
   const [showPassword, setShowPassword] = useState(false);
   
   const inputType = isPassword ? (showPassword ? "text" : "password") : type;

   return (
      <div className="flex flex-col gap-1.5 w-full max-w-full box-border">

         {
            label && (
               <label className="text-[14px] font-medium text-slate-600 ml-0.5">
                  {label}
               </label>
            )
         }

         <div className="relative w-full">
            {
               icon && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                     {icon}
                  </div>
               )
            }

            <input
               ref={ref}
               {...rest}
               type={inputType}
               className={`
                  w-full box-border bg-white border rounded-[10px] outline-none transition-all
                  h-12.5 md:h-12.25 
                  py-2 md:py-3.5 
                  text-[14px] md:text-[16px]                  
                  ${icon ? 'pl-11 md:pl-12' : 'pl-4'} 
                  ${isPassword ? 'pr-11 md:pr-12' : 'pr-4'}
                  placeholder:text-slate-500
                  focus:border-blue-600 focus:ring-2 focus:ring-green-50/50
                  disabled:bg-slate-50 disabled:cursor-not-allowed               
                  ${error ? "border-red-400 ring-red-50" : "border-blue-200 hover:border-blue-300"}               
                  ${className}
               `}
            />

            {
               isPassword && (
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                     {
                        showPassword ? (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                           </svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                           </svg>
                        )
                     }
                  </button>
               )
            }

         </div>         
            {
               error && <span className="text-xs text-red-500 font-medium ml-1 mt-0.5">{error}</span>
            }
         </div>
      );
   }
);
