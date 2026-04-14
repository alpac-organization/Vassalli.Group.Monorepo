import type { ReactNode } from "react";
import { ServerErrorFullscreen } from "@app/shared/components/server-error-fullscreen/server-error-fullscreen";
import { useServerErrorStore } from "@app/shared/stores/useServerErrorStore";

type GlobalServerErrorGateProps = {
  children: ReactNode;
};

export function GlobalServerErrorGate({ children }: GlobalServerErrorGateProps) {
  const isVisible = useServerErrorStore((s) => s.isVisible);

  return (
    <>
      {children}
      {isVisible ? <ServerErrorFullscreen /> : null}
    </>
  );
}
