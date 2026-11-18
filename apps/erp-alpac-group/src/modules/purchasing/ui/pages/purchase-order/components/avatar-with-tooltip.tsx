import { Avatar } from "@alpac/design-system";

interface AvatarWithTooltipProps {
  fullname: string;
  pictureUrl?: string;
  email: string;
}

export function AvatarWithTooltip({
  fullname,
  pictureUrl,
  email,
}: AvatarWithTooltipProps) {
  return (
    <Avatar
      label={fullname}
      pictureUrl={pictureUrl}
      tooltipPlacement="top"
      tooltip={
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            Correo
          </span>
          <span className="break-all text-sm font-medium text-slate-900 dark:text-white">
            {email}
          </span>
        </div>
      }
    />
  );
}
