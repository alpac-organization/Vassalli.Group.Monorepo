import { Fragment } from "react"
import { DashBoardCard } from "@alpac/design-system"
import { Navbar } from "@app/shared/components/navbar/navbar"

export const HomePage = function(){
   return (
      <Fragment>
         
         <Navbar />

         <div className="max-w-70">
            <DashBoardCard  title="Hola" image="https://" onClick={() => {}} />
         </div>

      </Fragment>
   )
}