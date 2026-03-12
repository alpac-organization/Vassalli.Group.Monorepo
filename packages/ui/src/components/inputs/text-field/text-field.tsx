import { Fragment } from "react"
import { TextFieldProps } from "./text-field.type"

export const TextField = function(props: TextFieldProps): JSX.Element {

   const {
      type = "text",
      placeholder = "Enter your placehoder here!",
      disabled
   } = props;
   
   return (
      <Fragment>
         <input 
            type={type}
            placeholder={placeholder}
            disabled={ disabled }
                        
         />
      </Fragment>
   )
}