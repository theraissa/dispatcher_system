import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { ProfileClient } from "../types/type"
import { apiClient } from "./api-client"

/**
 * Busca o perfil completo do usuário cliente
 */
export async function getClientProfile(userId: string) {
    const response = await apiClient.get<ProfileClient>(
        BACKEND_ROUTES.users.getById(userId)
    )
    return response
}

/**
 * Atualiza o perfil do usuário cliente
 */
export async function updateClientProfile(userId: string, data: ProfileClient) {
    const response = await apiClient.put<ProfileClient>(
        BACKEND_ROUTES.users.updateById(userId),
        data
    )
    return response
}
