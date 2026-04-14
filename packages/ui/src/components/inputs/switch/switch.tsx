import { forwardRef } from "react"
import type { SwitchProps } from "./switch.type"

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
   return (
      <div className={className}>
         <input type="checkbox" ref={ref} {...props} />
      </div>
   )
})