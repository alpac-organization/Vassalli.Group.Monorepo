import { forwardRef } from "react"
import { ButtonRoundedProps } from "./button-rounded.type"
import { ButtonRoundedStyles } from "./button-rounde.styles"

export const ButtonRounded = forwardRef<HTMLButtonElement, ButtonRoundedProps>((props, reference) => {

   const {
      onClick = () => { },
      label,
      hasIcon = false,
      icon: Icon,
      iconSize = 18,
      className = ""
   } = props


   return (
      <button
         ref={reference}
         onClick={() => onClick()}
         className={`${ButtonRoundedStyles} ${className}`}
      >
         {
            (hasIcon && Icon) && <Icon className="text-[#F3F3F3] group-hover:text-white transition-colors" size={iconSize} />
         }
         {
            label && <span className="hidden md:block">{label}</span>
         }
      </button>
   )
}) 