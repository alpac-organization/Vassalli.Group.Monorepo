import { Fragment, useState } from "react"
import { DashBoardCard, InputText, Modal } from "@alpac/design-system"
import { Navbar } from "@app/shared/components/navbar/navbar"

export const HomePage = function(){

   

   const [showModal, setShowModal] = useState(false)

   const userName = "Andrés"; 
   const companyName = "Alpac Group Nicaragua";

   return (
      <Fragment>

         <Navbar />

         <header className="max-w-330 m-auto p-3 mt-5 flex flex-col md:flex-row md:items-end justify-between">
            <div>
               <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                  Panel de Control
               </span>
               <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                  Buen día, {userName}
               </h1>
               <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                  Gestionando: <span className="font-medium text-slate-700 dark:text-slate-200">{companyName}</span>
               </p>
            </div>
            

            <div className="mt-4 md:mt-0 text-right">
               <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                  <span className="w-2 h-2 mr-2 rounded-full bg-green-500 animate-pulse"></span>
                  Sistema en línea
               </div>
            </div>
         </header>

         <div className="max-w-330 m-auto p-3">
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800 my-4"></div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
               Módulos disponibles
            </h3>
         </div>


         <div className="max-w-330 m-auto mt-2 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            
            <DashBoardCard  
               title="Nómina" 
               image="https://" 
               onClick={() => {}} 
            />

            <DashBoardCard  
               title="Contabilidad" 
               image="https://" 
               onClick={() => {}} 
            />

            <DashBoardCard  
               title="Facturación" 
               image="https://" 
               onClick={() => {}} 
            />

            <DashBoardCard  
               title="Inventario" 
               image="https://" 
               onClick={() => {}} 
            />

            <DashBoardCard  
               title="Nómina" 
               image="https://" 
               onClick={() => {}} 
            />
         </div>

         <Modal 
            isOpen
            title="Ha ocurrido un error"
            variant="warning"
            description="Descripcion"
            onClose={() => {

            }}
            children={
               <InputText label="Indica tu error" placeholder="placeholder"/>
            }
         />

      </Fragment>
   )
}