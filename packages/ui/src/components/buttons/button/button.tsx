import { Fragment } from "react"
import type { ButtonProps } from "./button.type"
import { getButtonStyles } from "./button.styles"

export const Button = function (props: ButtonProps): JSX.Element {

   const {
      type,
      label = "label",
      disabled = false,
      styles,
      onClick = () => { }
   } = props;

   const mergedStyles = {
      ...styles,
      ...getButtonStyles({ ...props })
   }

   return (
      <Fragment>
         <button
            type={type}
            style={mergedStyles}
            disabled={disabled}
            onClick={onClick}
         >
            {label}
         </button>
      </Fragment>
   )
}