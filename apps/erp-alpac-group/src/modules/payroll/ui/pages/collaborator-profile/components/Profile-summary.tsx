import { UserRound } from 'lucide-react';
import { useTheme } from '@alpac/design-system';
import { useUserStore } from '@app/shared/stores/useUserStore';
import { useCompanyStore } from '@app/shared/stores/useCompanyStore';
import type { GetCollaboratorProfileDetailsResponse } from '@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response';

export type ProfileSummaryProps = {
  profile?: GetCollaboratorProfileDetailsResponse | null;
};

export const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  const { fullName, companyName, userName } = useUserStore();
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === 'dark' ? neutralUrlImage : urlImage;

  const displayName = profile?.full_name
    ? profile.full_name
    : fullName
      ? fullName
      : userName || 'Usuario';

  const textBlock = (
    <div className="min-w-0 flex-1 text-left">
      <p className="wrap-break-word text-lg font-semibold leading-snug text-white sm:text-xl">
        {displayName}
      </p>
      {companyName ? (
        <p className="mt-0.5 wrap-break-word text-base leading-snug text-slate-400 sm:text-lg">
          {companyName}
        </p>
      ) : null}
    </div>
  );

  const avatarContent = profile?.profile_picture_url ? (
    <img
      src={profile.profile_picture_url}
      alt=""
      className="h-full w-full rounded-full object-cover"
      loading="lazy"
      decoding="async"
    />
  ) : (
    <UserRound
      className="h-7 w-7 text-cyan-400 sm:h-8 sm:w-8"
      strokeWidth={1.75}
    />
  );

  const avatarContentLarge = profile?.profile_picture_url ? (
    <img
      src={profile.profile_picture_url}
      alt=""
      className="h-full w-full rounded-full object-cover"
      loading="lazy"
      decoding="async"
    />
  ) : (
    <UserRound className="h-10 w-10 text-cyan-400" strokeWidth={1.75} />
  );

  return (
    <section
      className="mt-4 mb-6 w-full min-w-0 rounded-2xl border border-white/10 bg-[#363a45] px-4 py-4 sm:mt-6 sm:px-6 sm:py-5"
      aria-label="Resumen de perfil"
    >
      <div className="flex w-full min-w-0 flex-col gap-3 sm:hidden">
        <div className="flex w-full justify-center px-1 items-center ">
          <img
            src={activeLogo}
            alt={companyName ? `Logo ${companyName}` : 'Logo de la empresa'}
            className="h-auto max-h-16 w-auto max-w-64 object-contain object-center sm:max-h-20 sm:max-w-72"
            sizes="224px"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex w-full justify-center px-1">
          <div className="flex min-w-0 max-w-full flex-row items-center gap-3">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 sm:h-16 sm:w-16"
              aria-hidden
            >
              {avatarContent}
            </div>
            <p className="max-w-[min(100%,16rem)] wrap-break-word text-left text-lg font-semibold leading-snug text-white sm:text-xl">
              {displayName}
            </p>
          </div>
        </div>
        {companyName ? (
          <p className="w-full wrap-break-word text-center text-base leading-snug text-slate-400 sm:text-lg">
            {companyName}
          </p>
        ) : null}
      </div>

      <div className="hidden min-w-0 flex-col gap-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15"
            aria-hidden
          >
            {avatarContentLarge}
          </div>
          {textBlock}
        </div>
        <div className="flex h-24 w-full max-w-[min(100%,16rem)] shrink-0 items-center justify-end sm:h-24 sm:max-w-[min(100%,17rem)]">
          <img
            src={activeLogo}
            alt={companyName ? `Logo ${companyName}` : 'Logo de la empresa'}
            className="max-h-20 max-w-full object-contain object-right"
            sizes="(max-width: 768px) 224px, 280px"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
