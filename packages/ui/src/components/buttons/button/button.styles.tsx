import { spacings } from "../../../constants/spacing";
import { fontSizes } from "../../../constants/typography";
import { companyTokens, neutralTokens } from "../../../constants/colors";
import { ButtonClassicProps, ButtonSize, Company } from "./button.type";

interface Properties {
   paddingVertical:   string;
   paddinghorizontal: string;
   
   fontSize: string;
   fontWeight: number;
}

const typographyProperties: Record<ButtonSize, Pick<Properties, "fontSize" | "fontWeight">> = {
   Gian: {
      fontSize: fontSizes["2xl"],
      fontWeight: 500
   },
   Medium: {
      fontSize: fontSizes["2xl"],
      fontWeight: 500
   },
   Small: {
      fontSize: fontSizes["2xl"],
      fontWeight: 500
   }
}

const sizeProperties: Record<ButtonSize, Pick<Properties, "paddingVertical" | "paddinghorizontal">> = {
   Gian: {
      paddinghorizontal: spacings["2xl"],
      paddingVertical:   spacings.xl
   },
   Medium: {
      paddinghorizontal: spacings.none,
      paddingVertical:   spacings.none
   },
   Small: {
      paddinghorizontal: spacings.none,
      paddingVertical:   spacings.none
   }
}

const backgroundProperties: Record<Company, string> = {
   ALPAC:   companyTokens.ALPAC.primary.base500,
   AMINSA:  companyTokens.AMINSA.primary.base500,
   AVASA:   companyTokens.AVASA.primary.base500,
   VIGEMSA: companyTokens.VIGEMSA.primary.base500,
   TMN:     companyTokens.TMN.primary.base500
};

export const getStylesButton = (props: ButtonClassicProps): React.CSSProperties => {

   const sizePropertie       = sizeProperties[props.size || "Gian"]
   const backgroundPropertie = backgroundProperties[props.company || "ALPAC"];

   return {
      paddingTop:      sizePropertie.paddinghorizontal,
      paddingBottom:   sizePropertie.paddinghorizontal,
      paddingLeft:     sizePropertie.paddingVertical,
      paddingRight:    sizePropertie.paddingVertical,

      width:           props.isDynamic ? "100%" : "150px",

      backgroundColor: props.disabled ? neutralTokens.base100 : backgroundPropertie,
      cursor:          props.disabled ? "not-allowed" : "pointer",

      color: neutralTokens.base100,
   };
};