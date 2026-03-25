import type { LoginRequest } from "../../domain/ApiContract/Requests/login.request";
import type { LoginResponse } from "../../domain/ApiContract/Responses/login.response";

/**
 * @interface IAuthenticationServices
 * @description Define el contrato para los servicios de identidad y acceso.
 * Este puerto abstrae la lógica de autenticación, permitiendo que el dominio no dependa
 * directamente de la implementación (Axios, Fetch, o Mocks).
 */
export interface IAuthenticationServices {

    /**
     * @method StartLoginProcess
     * @description Inicia el flujo de validación de credenciales.
     * @param {LoginRequest} payload Datos de acceso (usuario y contraseña).
     * @returns {Promise<LoginResponse>} Promesa con los tokens y datos de la empresa de ALPAC.
     * @throws {Error} Si las credenciales son inválidas o hay fallo de conexión.
     */
    StartLoginProcess(payload: LoginRequest): Promise<LoginResponse>;

    /**
     * @method StartProcessToCloseSession
     * @description Finaliza la sesión actual del usuario.
     * Se encarga de invalidar los tokens en el servidor y limpiar el estado local.
     * @param {any} payload Información adicional necesaria para el cierre (opcional).
     * @returns {Promise<void>}
     */
    StartProcessToCloseSession(payload?: any): Promise<void>;

    /**
     * @method RefreshToken
     * @description Renueva el access_token utilizando un refresh_token vigente.
     * @param {string} refreshToken El token de refresco obtenido durante el login.
     * @returns {Promise<LoginResponse>} Un nuevo par de tokens (access y refresh).
     * @throws {Error} Si el refresh_token es inválido o ha expirado.
     */
    StartProcessToRefreshToken(payload?: any): Promise<any>;
}