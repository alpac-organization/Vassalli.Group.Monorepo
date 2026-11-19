import { memo, useCallback, useState } from "react";
import type { SenderInfoProps } from "./sender-info.types";

export const SenderInfo = memo(function SenderInfo(props: SenderInfoProps) {
  const { fullname, pictureUrl, workArea } = props;
  const [imageFailed, setImageFailed] = useState(false);
  const handleImageError = useCallback(() => setImageFailed(true), []);

  return (
    <div className="flex items-start gap-3">
      {pictureUrl && !imageFailed ? (
        <img
          src={pictureUrl}
          alt={fullname ?? "Usuario"}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-neutral-700"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-neutral-700 dark:text-slate-200"
        >
          {fullname}
        </span>
      )}
      <div className="min-w-0">
        <span className="">Enviado por</span>
        <p className="m-0 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
          {fullname}
        </p>
        {workArea && (
          <p className="m-0 truncate text-xs text-slate-500 dark:text-slate-400">
            {workArea}
          </p>
        )}
      </div>
    </div>
  );
});
