import { Fragment } from "react"
import { DashBoardCard } from "@alpac/design-system"
import { Navbar } from "@app/shared/components/navbar/navbar"

export const HomePage = function(){
   return (
      <Fragment>
         
         <Navbar />

         <div className="max-w-330 m-auto mt-10 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            
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
         </div>

      </Fragment>
   )
}