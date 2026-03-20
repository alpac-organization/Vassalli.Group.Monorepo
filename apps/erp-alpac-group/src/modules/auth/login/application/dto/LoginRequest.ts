export interface LoginRequest {
    username: string,
    password: string
}

export interface LoginResponse {
    username: string,
    companyId: string,
    token: string
}