import { Avatar } from "@alpac/design-system";

import type { SenderInfoProps } from "./sender-info.types";

export const SenderInfo = function ({
  fullname,
  pictureUrl,
  workArea,
}: SenderInfoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Enviado por
      </span>
      <Avatar
        label={fullname ?? "—"}
        pictureUrl={pictureUrl ?? undefined}
        description={workArea ?? undefined}
      />
    </div>
  );
};
