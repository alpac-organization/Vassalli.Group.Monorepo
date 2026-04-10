import { BannerProps, variants } from "./banner.type";

export const Banner = ({
  variant = "info",
  title,
  description,
}: BannerProps) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className="dark flex min-h-0 w-full max-w-full flex-col mb-10 text-slate-100">
      <div
        className={`relative overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6 shadow-2xl backdrop-blur-md ${config.base}`}
      >
        <div
          className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-20 ${config.iconBg}`}
        />

        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className={`text-base font-semibold ${config.title}`}>
              {title}
            </h3>

            <div className="text-sm leading-relaxed text-slate-300">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
