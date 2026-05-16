import { useTheme } from "../../../providers/theme-provider";
import { LogoTickerProps } from "./logo-ticker.type";
import logoDark from "../../../assets/image-dark.svg";
import logoLight from "../../../assets/image-light.svg";

export const LogoTicker = function (props: LogoTickerProps) {
  const { theme } = useTheme();
  const currentLogo = theme === "dark" ? logoLight : logoDark;
  const baseClasses = `bg-transparent dark:bg-transparent 
        dark:text-white py-6 
        overflow-hidden w-full max-w-[800px] 
        mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] 
        ${props.className || ""}`;
  const allLogos = props.imageUrls
    ? [...props.imageUrls, ...props.imageUrls]
    : [];

  return (
    <div className={baseClasses}>
      <div className="mx-auto px-6 lg:px-8">
        <h2 className="text-center text-[20px]! font-semibold my-[30px]! bg-transparent dark:bg-transparent dark:text-white text-gray-900">
          {props.title}
        </h2>
        <div className="flex animate-scroll w-max items-center">
          {allLogos.map((url, index) => (
            <img
              key={index}
              alt={url ? "Imagen" : "Sin imagen"}
              src={url ? url : currentLogo}
              className="max-h-16 w-auto object-contain shrink-0 pr-24"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
