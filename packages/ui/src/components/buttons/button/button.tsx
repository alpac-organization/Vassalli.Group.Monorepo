import { Fragment } from "react";
import type { ButtonProps } from "./button.type";
import { getButtonStyles } from "./button.styles";
import { Spinner } from "../../spinners";

export const Button = function (props: ButtonProps): React.ReactElement {
  const {
    type,
    label = "",
    disabled = false,
    styles,
    className,
    isLoading = false,
    icon,
    isHiddenLabelOnMobile = false,
    tooltip,
    ariaLabel,
    onClick = () => {},
  } = props;

  const classes = getButtonStyles({ ...props });
  const showTooltip = Boolean(tooltip?.trim());

  return (
    <Fragment>
      <button
        type={type}
        style={styles}
        className={`${classes} ${className ?? ""} relative ${
          showTooltip ? "group isolate overflow-visible" : "overflow-hidden"
        }`}
        disabled={disabled || isLoading}
        onClick={onClick}
        aria-label={ariaLabel}
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
          className={`relative z-0 flex items-center justify-center gap-2 transition-all ${
            isLoading ? "invisible opacity-0" : "visible opacity-100"
          }`}
        >
          {icon && (
            <span className="flex items-center justify-center">{icon}</span>
          )}
          {label && (
            <span className={isHiddenLabelOnMobile ? "hidden md:inline" : ""}>
              {label}
            </span>
          )}
        </div>
        {showTooltip && (
          <span
            role="tooltip"
            className="pointer-events-none absolute right-full top-1/2 z-100 mr-2 hidden min-w-max -translate-y-1/2 shrink-0 items-center opacity-0 transition-all duration-200 ease-out md:flex md:translate-x-1 md:scale-95 md:group-hover:translate-x-0 md:group-hover:scale-100 md:group-hover:opacity-100"
          >
            <span className="whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-lg dark:bg-slate-700">
              {tooltip?.trim()}
            </span>
            <span
              className="h-0 w-0 shrink-0 border-y-[6px] border-l-[6px] border-r-[7px] border-y-transparent border-l-transparent border-r-slate-800 dark:border-r-slate-700"
              aria-hidden={true}
            />
          </span>
        )}
      </button>
    </Fragment>
  );
};
