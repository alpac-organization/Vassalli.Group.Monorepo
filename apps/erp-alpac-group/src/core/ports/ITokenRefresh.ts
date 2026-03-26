import type { RefreshTokenRequest } from "@app/modules/auth/domain/ApiContract/Requests/refresh.token.request";

export interface ITokenRefresh {
    /**
     * @method StartProcessToRefreshToken
     * @description Renueva el access_token utilizando un refresh_token vigente.
     * @param {RefreshTokenRequest} payload El token de refresco obtenido durante el login.
     * @returns {Promise<any>} Un nuevo par de tokens (access y refresh).
     * @throws {Error} Si el refresh_token es inválido o ha expirado.
     */
    StartProcessToRefreshToken(payload: RefreshTokenRequest): Promise<any>;
}