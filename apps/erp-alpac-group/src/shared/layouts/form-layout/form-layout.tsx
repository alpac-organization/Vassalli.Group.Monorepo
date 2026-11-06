import type { FormLayoutProps } from "./form-layout.type";

import Logo from "../../../assets/logos/color/vasalli-neutral-logo.png";
import { CopyRight } from "@app/shared/components/copy-right/copy-right";

export const FormLayout = ({ children, imageUrl = Logo }: FormLayoutProps) => {
  return (
    <div className="flex flex-col w-full min-h-dvh md:min-h-auto items-center justify-center">
      <div className="flex flex-col w-full min-h-dvh md:min-h-70 md:w-108 bg-white md:rounded-2xl transition-all duration-300 px-5 py-8 md:px-8 md:py-9">
        <div className="mb-8 mx-auto flex h-25 w-25 items-center justify-center overflow-hidden">
          <div
            key={imageUrl}
            className="h-full w-full bg-contain bg-center bg-no-repeat transition-all duration-700 ease-in-out animate-bg-fade-logo"
            style={{ backgroundImage: `url(${imageUrl})` }}
            role="img"
            aria-label="Logo"
          ></div>
        </div>

        <div className="flex flex-col flex-1 w-full text-zinc-900 md:justify-center mt-10 md:mt-0 md:items-center items-start">
          <div className="w-full">{children}</div>
        </div>

        <footer className="mt-8 relative z-10">
          <CopyRight />
        </footer>
      </div>
    </div>
  );
};
