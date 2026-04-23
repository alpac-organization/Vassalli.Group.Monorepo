import { useRef } from "react";

type UsePermissionPageInitialLoaderParams = {
  /** Sesión con empresa, módulo e identificación listos para disparar las queries. */
  contextReady: boolean;
  isSaldoPending: boolean;
  isProfilePending: boolean;
  isHistoryPending: boolean;
};

/**
 * Loader a pantalla completa solo en la primera carga (saldo + perfil + historial).
 * No se va a mostrar al refetch por filtros u otras invalidaciones posteriores.
 */
export function utilsPermissionPageInitialLoader({
  contextReady,
  isSaldoPending,
  isProfilePending,
  isHistoryPending,
}: UsePermissionPageInitialLoaderParams): boolean {
  const initialLoadCompletedRef = useRef(false);

  const allSettled = !isSaldoPending && !isProfilePending && !isHistoryPending;
  const anyPending = isSaldoPending || isProfilePending || isHistoryPending;

  if (contextReady && allSettled) {
    initialLoadCompletedRef.current = true;
  }

  return contextReady && !initialLoadCompletedRef.current && anyPending;
}
