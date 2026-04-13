import type { ProfileUser } from "@/types/user.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"


/**
 * Busca o perfil completo do usuário cliente
 */
export async function getClientProfile(userId: string) {
    const response = await apiClient.get<ProfileUser>(
        BACKEND_ROUTES.users.getById(userId)
    )
    return response
}

/**
 * Atualiza o perfil do usuário cliente
 */
export async function updateClientProfile(userId: string, data: ProfileUser) {
    const response = await apiClient.put<ProfileUser>(
        BACKEND_ROUTES.users.updateById(userId), data
    )
    return response
}
