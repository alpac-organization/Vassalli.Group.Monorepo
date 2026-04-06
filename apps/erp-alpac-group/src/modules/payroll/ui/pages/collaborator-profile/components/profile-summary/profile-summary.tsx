import { Briefcase } from "lucide-react";
import { Badges, useTheme } from "@alpac/design-system";
import {
  labelsStatusColor,
  statusLabel,
} from "@app/modules/payroll/ui/pages/collaborator-profile/components/profile-summary/types/profile-summary.variants";
import { useCompanyStore } from "@app/shared/stores/useCompanyStore";
import type { ProfileSummaryProps } from "@app/modules/payroll/ui/pages/collaborator-profile/components/profile-summary/types/profile-summary.type";

export const ProfileSummary = ({ profile }: ProfileSummaryProps) => {
  const { theme } = useTheme();
  const { urlImage, neutralUrlImage } = useCompanyStore();

  const activeLogo = theme === "dark" ? neutralUrlImage : urlImage;

  const defaultProfilePicture =
    "https://ui-avatars.com/api/?background=272b34&color=fff&name=Usuario";

  return (
    <section
      className="relative mb-8 w-full overflow-hidden border border-slate-600	 bg-[#272b34] p-6"
      aria-label="Resumen de perfil"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-500/5 blur-[80px]" />
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-slate-700 to-slate-800 ring-2 ring-cyan-500/20 sm:h-24 sm:w-24">
            <img
              src={profile?.profile_picture_url || defaultProfilePicture}
              alt={
                profile?.full_name
                  ? `Foto de perfil de ${profile.full_name}`
                  : "Foto de perfil del colaborador"
              }
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {profile?.full_name || ""}
            </h1>

            <div className="mt-1 flex items-center gap-2 mb-1.5">
              <Briefcase size={14} className="shrink-0" />

              <p className="text-sm font-semibold uppercase tracking-wider sm:text-base">
                {profile?.working_information.work_position ||
                  "Cargo no disponible"}
              </p>
            </div>

            <div className="mt-1 flex items-center gap-2 ">
              <Badges
                color={
                  labelsStatusColor[profile?.status || ""] ||
                  "bg-slate-500/10 text-slate-400 ring-slate-100/20"
                }
                label={
                  statusLabel[profile?.status || ""] || "Estado no disponible"
                }
              />
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center border-t border-slate-700/50 pt-6 sm:w-auto sm:border-none sm:pt-0">
          <div className="group relative flex items-center justify-center">
            <img
              src={activeLogo}
              alt={"Logo Empresa"}
              className="h-auto max-h-16 w-auto max-w-50 object-contain opacity-95 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 sm:max-h-24 sm:max-w-[280px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
