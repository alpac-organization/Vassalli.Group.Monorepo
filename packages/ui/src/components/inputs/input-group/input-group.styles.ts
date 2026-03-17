import { CSSProperties } from "react"
import { feedbackTokens } from "../../../constants"

export const getLabelStyles = (): CSSProperties => {
    return { fontWeight: "500" }
}

export const getInputGroupStyles = (): CSSProperties => {

    return {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    }
}

export const getErrorStyles = (): CSSProperties => {
    return {
        color: feedbackTokens.error
    }
}