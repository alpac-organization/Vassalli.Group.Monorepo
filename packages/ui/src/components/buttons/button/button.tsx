import { Fragment } from "react"
import type { ButtonProps } from "./button.type"
import { getButtonStyles } from "./button.styles"
import { Spinner } from "../../spinners";

export const Button = function (props: ButtonProps): React.ReactElement {

  const {
    type,
    label = "label",
    disabled = false,
    styles,
    className,
    isLoading = false,
    onClick = () => { }
  } = props;

  const classes = getButtonStyles({ ...props });

  return (
    <Fragment>
      <button
        type={type}
        style={styles}
        className={`${classes} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {isLoading ? <Spinner color="white" size={props.size === "giant" ? "medium" : "small"} /> : label}
      </button>
    </Fragment>
  )
}