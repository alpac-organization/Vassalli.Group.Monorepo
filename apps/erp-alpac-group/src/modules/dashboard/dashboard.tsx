import { Fragment } from "react"
import { Button } from "@design-system/index"

export const Dashboard = function () {
   return (
      <Fragment>
         <div style={{ display: "flex", gap: 20 }}>
            
            <Button 
               company="AVASA"
               label="Button" 
            />

         </div>
      </Fragment>
   )
}