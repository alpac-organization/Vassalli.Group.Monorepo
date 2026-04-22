import errorHandlerIllustration from "@app/assets/errors/errorHandler.webp";

const MESSAGE =
  "En estos momentos el servidor no se encuentra disponible por motivos técnicos. Por favor, inténtelo nuevamente más tarde.";

export function ServerErrorFullscreen() {
  return (
    <div
      className="fixed inset-0 z-9999 min-h-dvh bg-alpac-primary-700 flex flex-col items-center justify-center px-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex max-w-lg flex-col items-center gap-8">
        <img
          src={errorHandlerIllustration}
          alt=""
          className="w-full max-w-xs object-contain md:max-w-sm"
          width={320}
          height={240}
          decoding="async"
        />
        <p className="text-base leading-relaxed text-white/95 md:text-lg">
          {MESSAGE}
        </p>
      </div>
    </div>
  );
}
