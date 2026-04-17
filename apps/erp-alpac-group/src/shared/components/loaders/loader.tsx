import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export const Loader = function ({
  title = "Cargando módulos...",
}: {
  title?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-auto fixed inset-0 z-9999 flex min-h-dvh w-full flex-col items-center justify-center bg-[#1a1f2b]/60 backdrop-blur-[1px] transition-opacity">
      <section className="flex max-w-[min(100vw-2rem,28rem)] flex-col items-center justify-center gap-5 rounded-2xl p-8 text-center">
        <span className="loader" />
        <p className="animate-pulse text-sm font-medium tracking-wide text-gray-300">
          {title}
        </p>
      </section>
    </div>,
    document.body,
  );
};
