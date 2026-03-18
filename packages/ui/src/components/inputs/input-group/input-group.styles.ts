import { feedbackTokens } from "../../../constants"

export const getLabelStyles = (): string => {
    return "text-sm"
}

export const getInputGroupStyles = (): string => {
    return "flex flex-col w-full"
}

export const getErrorStyles = (): string => {
    return `text-xs dark:text-[#D54144] text-[${feedbackTokens.error.light}]`
}