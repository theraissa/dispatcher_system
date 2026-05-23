import { BACKEND_ROUTES } from "../routes/backend-routes";
import type { LoginRequest, LoginResponse } from "../types/type";
import { apiClient } from "./api-client";


export const authService = {

    /**
     * Informa ao backend que o token deve ser invalidado (Blacklist).
     */
    logoutRequest(): Promise<void> {
        return apiClient.post(BACKEND_ROUTES.auth.logout)
    },

    /**
     * Realiza a autenticação do usuário no backend.
     */
    loginRequest(data: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(BACKEND_ROUTES.auth.login, data)
    },
}
