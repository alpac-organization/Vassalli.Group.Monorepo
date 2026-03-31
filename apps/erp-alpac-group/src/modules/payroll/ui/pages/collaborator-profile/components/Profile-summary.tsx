import { UserRound } from "lucide-react";
import { useImage } from "@app/shared/hooks/useImage";
import { useUserStore } from "@app/shared/stores/useUserStore";
import { validateNameAndLastName } from "@app/shared/utils/format-name";

export const ProfileSummary = () => {
  const { fullName, companyName, companyAlias, userName } = useUserStore();
  const companyAliasWhite = String(companyAlias ?? "")
    .toLowerCase()
    .concat(".white");
  const { urlImage } = useImage(companyAliasWhite);
  const displayName = fullName
    ? validateNameAndLastName(fullName)
    : userName || "Usuario";

  const textBlock = (
    <div className="min-w-0 flex-1 text-left">
      <p className="wrap-break-word text-base font-semibold leading-snug text-white sm:text-lg">
        {displayName}
      </p>
      {companyName ? (
        <p className="mt-0.5 wrap-break-word text-sm leading-snug text-slate-400">
          {companyName}
        </p>
      ) : null}
    </div>
  );

  return (
    <section
      className="mt-4 mb-6 w-full min-w-0 rounded-2xl border border-white/10 bg-[#363a45] px-4 py-4 sm:mt-6 sm:px-6 sm:py-5"
      aria-label="Resumen de perfil"
    >
      <div className="flex w-full min-w-0 flex-col gap-3 sm:hidden">
        <div className="flex w-full justify-center px-1 items-center ">
          <img
            src={urlImage}
            alt={companyName ? `Logo ${companyName}` : "Logo de la empresa"}
            className="h-auto max-h-14 w-auto max-w-56 object-contain object-center"
            sizes="224px"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex w-full justify-center px-1">
          <div className="flex min-w-0 max-w-full flex-row items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
              aria-hidden
            >
              <UserRound className="h-5 w-5 text-cyan-400" strokeWidth={1.75} />
            </div>
            <p className="max-w-[min(100%,16rem)] wrap-break-word text-left text-base font-semibold leading-snug text-white">
              {displayName}
            </p>
          </div>
        </div>
        {companyName ? (
          <p className="w-full wrap-break-word text-center text-sm leading-snug text-slate-400">
            {companyName}
          </p>
        ) : null}
      </div>

      <div className="hidden min-w-0 flex-col gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
            aria-hidden
          >
            <UserRound className="h-8 w-8 text-cyan-400" strokeWidth={1.75} />
          </div>
          {textBlock}
        </div>
        <div className="flex h-20 w-full max-w-[min(100%,14rem)] shrink-0 items-center justify-end sm:h-20 sm:max-w-[min(100%,15rem)]">
          <img
            src={urlImage}
            alt={companyName ? `Logo ${companyName}` : "Logo de la empresa"}
            className="max-h-16 max-w-full object-contain object-right"
            sizes="(max-width: 768px) 224px, 280px"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
