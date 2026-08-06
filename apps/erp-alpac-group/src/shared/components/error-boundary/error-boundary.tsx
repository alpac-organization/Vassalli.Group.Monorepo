import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
   const error = useRouteError();
   const navigate = useNavigate();

   const title = isRouteErrorResponse(error)
      ? `Error ${error.status}`
      : "Ocurrió un error inesperado";

   return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#1e2229] dark:text-slate-100">
         <div className="mx-auto max-w-3xl px-4 py-6">
            <div className="mb-6">
               <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                     <AlertTriangle className="h-5 w-5" />
                  </span>
                  {title}
               </h1>
               <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Algo salió mal al procesar esta página
               </p>
            </div>

            <hr className="mb-6 border-slate-200 dark:border-neutral-600" />

            <div className="mb-4">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Acciones
               </h2>
               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Intenta recargar la página o vuelve al inicio
               </p>
            </div>

            <div className="flex flex-wrap gap-3 rounded-md border border-slate-200 bg-white p-4 dark:border-neutral-600 dark:bg-[#272b34]">
               <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-md bg-alpac-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-alpac-primary-600 dark:bg-alpac-primary-700 dark:hover:bg-alpac-primary-500"
               >
                  <RotateCcw className="h-4 w-4" />
                  Reintentar
               </button>

               <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
               >
                  <Home className="h-4 w-4" />
                  Volver al inicio
               </button>
            </div>
         </div>
      </div>
   );
};
