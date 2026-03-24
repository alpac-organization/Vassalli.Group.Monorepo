export const EmptyModulesState = function(){
   return (
      <div className="col-span-full flex flex-col items-center justify-center p-16 text-center bg-[#2a303c] border border-gray-700 rounded-2xl shadow-inner min-h-75">
         
         <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mb-8 border border-gray-700 shadow-xl">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
         </div>

         <div className="max-w-md">
            <h3 className="text-2xl font-semibold text-gray-100 mb-2">
               Aún no hay módulos para ti
            </h3>
            <p className="text-gray-400 text-base leading-relaxed">
               Parece que en este momento no se encuentran módulos activos configurados para tu cuenta de Alpac.
               <span className="block mt-1.5 font-medium text-gray-500">
                  (Tan pronto como se activen, aparecerán listados aquí automáticamente).
               </span>
            </p>
         </div>

      </div>
   )
}