/**
 * Este archivo define las utilidades y funciones para derivar y transformar el estado
 * de las consultas relacionadas al saldo y perfil de vacaciones de un colaborador,
 * a formatos útiles para la UI. Permite mostrar de manera legible
 * el saldo, el estado de la consulta (cargando, error, listo) y los datos relevantes
 * tanto en la visualización general como en el formulario/modal de solicitud de vacaciones.
 */

import type { GetCollaboratorProfileDetailsResponse } from "@app/modules/payroll/domain/ApiContract/Responses/get-collaborator-profile.response";
import type { GetVacationSaldoResponse } from "@app/modules/vacations/domain/ApiContract/Responses/vacation-saldo-response";

/**
 * Devuelve un texto legible para mostrar el saldo de días de vacaciones
 * según el contexto de la consulta: muestra "hubo un error, vuelve pronto!" si no está listo o hay error,
 * "cargando.." si está cargando, o el valor numérico si está disponible.
 */
function showBalanceVacationText(
  readyContext: boolean,
  isLoading: boolean,
  isError: boolean,
  valor: number | undefined,
): string {
  if (!readyContext) return "—";
  if (isLoading) return "cargando..";
  if (isError) return "hubo un error vuelve pronto!";
  return String(valor ?? "—");
}

export type ConsultaSaldoVacacionesTipo = {
  isLoading: boolean;
  isError: boolean;
  datos: GetVacationSaldoResponse | undefined;
};

/**
 * esta funcion tiene la responsabilidad de tomar el estado de una consulta de saldo de vacaciones
 * (incluyendo si el contexto está listo, si está cargando, si hay error y los datos asociados)
 * y lo transforma en un objeto con textos legibles y útiles para mostrar en la UI
 * ( ejemplo: días disfrutados, disponibles, generados y nombre del colaborador).
 */
export function derivarUiSaldoVacaciones(
  contextoSaldoListo: boolean,
  consulta: ConsultaSaldoVacacionesTipo,
) {
  const datos = consulta.datos;
  return {
    mostrarDiasDisfrutados: showBalanceVacationText(
      contextoSaldoListo,
      consulta.isLoading,
      consulta.isError,
      datos?.enjoyed_vacation,
    ),
    mostrarDiasDisponibles: showBalanceVacationText(
      contextoSaldoListo,
      consulta.isLoading,
      consulta.isError,
      datos?.available_vacations,
    ),
    mostrarDiasGenerados: showBalanceVacationText(
      contextoSaldoListo,
      consulta.isLoading,
      consulta.isError,
      datos?.genered_vacation,
    ),
    nombreColaboradorParaMostrar: (() => {
      if (!contextoSaldoListo) return undefined;
      if (consulta.isLoading || consulta.isError) return undefined;
      const nombre = datos?.full_name?.trim();
      return nombre !== "" ? nombre : undefined;
    })(),
  };
}

export type ConsultaPerfilColaboradorTipo = {
  isLoading: boolean;
  datos: GetCollaboratorProfileDetailsResponse | undefined;
};

/**
 * la funcion debe de tomar el estado de una consulta de perfil de colaborador
 * (incluyendo si el contexto está listo, si está cargando y los datos asociados)
 * tambien lo transforma en un objeto con texto legibles y útiles para la UI
 * ( ej: nombre del colaborador, puesto de trabajo y estado de carga).
 */
export function derivarUiModalNuevaVacacion(
  contextoSaldoListo: boolean,
  saldo: ConsultaSaldoVacacionesTipo,
  perfil: ConsultaPerfilColaboradorTipo,
  nombreCompletoInput: string | undefined,
) {
  const nombreDesdeSaldo = saldo.datos?.full_name?.trim();
  const nombreDesdePerfil = perfil.datos?.full_name?.trim();
  const nombreCompletoColaborador =
    nombreDesdeSaldo || nombreDesdePerfil || nombreCompletoInput?.trim() || "";

  const datosPerfil = perfil.datos;
  const puestoDeTrabajoColaborador =
    datosPerfil?.work_position?.trim() ||
    datosPerfil?.working_information?.work_position?.trim() ||
    "";

  /**
   * devuelve true si existe algún nombre de colaborador para mostrar,
   * verificando primero en los datos de saldo, luego en el perfil
   * y finalmente en el nombre completo proporcionado.
   */
  const hayTextoDeNombre =
    Boolean(saldo.datos?.full_name?.trim()) ||
    Boolean(perfil.datos?.full_name?.trim()) ||
    Boolean(nombreCompletoInput?.trim());

  const nombreColaboradorCargando =
    contextoSaldoListo &&
    !hayTextoDeNombre &&
    (saldo.isLoading || perfil.isLoading);

  const puestoColaboradorCargando =
    contextoSaldoListo && !puestoDeTrabajoColaborador && perfil.isLoading;

  return {
    nombreCompletoColaborador,
    puestoDeTrabajoColaborador,
    nombreColaboradorCargando,
    puestoColaboradorCargando,
  };
}
