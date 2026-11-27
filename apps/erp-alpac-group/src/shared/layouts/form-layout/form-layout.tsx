import type { FormLayoutProps } from "./form-layout.type";

import Logo from "../../../assets/logos/color/vasalli-neutral-logo.png";
import { CopyRight } from "@app/shared/components/copy-right/copy-right";

export const FormLayout = ({
  title = "Bienvenido",
  imageUrl = Logo,
  copyrightEntityName = "Grupo Vassalli",
  children,
}: FormLayoutProps) => {
  return (
    <div className="flex min-h-dvh w-full items-stretch justify-center md:min-h-0 md:items-center md:p-6">
      <div className="relative flex min-h-dvh w-full flex-col justify-between overflow-hidden bg-white px-6 py-8 transition-all duration-300 sm:px-10 md:min-h-0 md:w-[29rem] md:rounded-[24px] md:bg-white/97 md:px-10 md:py-10 md:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.65)] md:ring-1 md:ring-white/50 md:backdrop-blur-md">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent)]"
        />

        <header className="relative z-10 flex flex-col items-center pt-2 text-center md:pt-0">
          <div className="mb-4 flex h-20 w-44 items-center justify-center">
            <div
              key={imageUrl}
              className="h-full w-full bg-contain bg-center bg-no-repeat transition-all duration-500 ease-out"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          </div>

          <span className="mb-2 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-0.5 text-[11px] font-medium tracking-wide text-neutral-500 uppercase">
            Plataforma Corporativa
          </span>

          <h1 className="m-0 text-[24px] font-bold tracking-tight text-neutral-900">
            {title}
          </h1>
          <p className="m-0 mt-1 text-[13.5px] leading-relaxed text-neutral-500">
            Accede con tu cuenta a{" "}
            <span className="font-semibold text-neutral-800">
              {copyrightEntityName}
            </span>
          </p>
        </header>

        <div className="relative z-10 my-auto flex w-full flex-col py-6 text-neutral-900 md:my-0 md:pt-7 md:pb-5">
          {children}
        </div>

        <footer className="relative z-10 border-t border-neutral-100 pt-4">
          <CopyRight />
        </footer>
      </div>
    </div>
  );
};
