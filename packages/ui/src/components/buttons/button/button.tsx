import { Fragment } from "react"
import { getStylesButton } from "./button.styles";

import type { ButtonClassicProps } from "./button.type"

export const Button = function(props: ButtonClassicProps){

   const {
      label    = "label",
      disabled = false,
      size     = "Gian",
      onPress  = () => {}
   } = props;

   const styles = getStylesButton({... props});

   return (
      <Fragment>
         <button 
            style={styles}
            disabled={ disabled }
            onClick={() => onPress()}
         >
            { label }
         </button>
      </Fragment>
   )
}