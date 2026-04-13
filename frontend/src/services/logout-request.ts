import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"

/**
 * Informa ao backend que o token deve ser invalidado (Blacklist).
 */
export async function logoutRequest(): Promise<void> {
    // Note que não passamos corpo, pois o token vai no Header via interceptor do apiClient
    return apiClient.post(BACKEND_ROUTES.auth.logout)
}
