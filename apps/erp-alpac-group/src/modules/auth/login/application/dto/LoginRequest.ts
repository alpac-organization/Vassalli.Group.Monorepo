export interface LoginRequest {
    username: string,
    password: string
}

export interface LoginResponse {
    username: string,
    companyId: string,
    accessToken: string,
    refreshToken: string
}