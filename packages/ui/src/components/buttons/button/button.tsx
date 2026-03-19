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

   const classes = getButtonStyles({ ...props })

   return (
      <Fragment>
         <button
            type={type}
            style={styles}
            className={`${classes}`}
            disabled={disabled}
            onClick={onClick}
         >
            {label}
         </button>
      </Fragment>
   )
}