import { Fragment } from "react"
import type { ButtonProps } from "./button.type"
import { getButtonStyles } from "./button.styles"
import { Spinner } from "../../spinners";

export const Button = function (props: ButtonProps): JSX.Element {

  const {
    type,
    label = "label",
    disabled = false,
    styles,
    isLoading = false,
    onClick = () => { }
  } = props;

  const classes = getButtonStyles({ ...props });

  return (
    <Fragment>
      <button
        type={type}
        style={styles}
        className={`${classes}`}
        disabled={disabled}
        onClick={onClick}
      >
        {isLoading ? <Spinner color="white" size={props.size === "giant" ? "medium" : "small"} /> : label}
      </button>
    </Fragment>
  )
}