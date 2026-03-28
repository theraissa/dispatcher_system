import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { LoginRequest, LoginResponse } from "../types/type"

/**
 * Realiza a autenticação do usuário no backend.
 */
export async function loginRequest(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(BACKEND_ROUTES.auth.login, data)
}
