import { Fragment } from "react";
import type { ButtonProps } from "./button.type";
import { getButtonStyles } from "./button.styles";
import { Spinner } from "../../spinners";

export const Button = function (props: ButtonProps): React.ReactElement {
  const {
    type,
    label = "label",
    disabled = false,
    styles,
    className,
    isLoading = false,
    icon,
    onClick = () => {},
  } = props;

  const classes = getButtonStyles({ ...props });

  return (
    <Fragment>
      <button
        type={type}
        style={styles}
        className={`${classes} ${className} relative overflow-hidden`}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {/* Layer del Spinner: Solo visible en carga */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner
              color="white"
              size={props.size === "giant" ? "medium" : "small"}
            />
          </div>
        )}

        {/* Layer de Contenido: Mantiene el tamaño aunque sea invisible */}
        <div
          className={`flex items-center justify-center gap-2 transition-all ${
            isLoading ? "invisible opacity-0" : "visible opacity-100"
          }`}
        >
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
          {label && <span>{label}</span>}
        </div>
      </button>
    </Fragment>
  );
};
