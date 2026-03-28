import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { ProfileDispatcher } from "../types/type"
import { apiClient } from "./api-client"

/**
 * Busca o perfil completo do despachante
 */
export async function getDispatcherProfile(userId: string) {
    const response = await apiClient.get<ProfileDispatcher>(
        BACKEND_ROUTES.dispatcher.profile(userId)
    )

    console.log("RAW RESPONSE:", response)
    console.log("RAW:", response)
    return response
}

/**
 * Atualiza o perfil completo do despachante
 */
export async function updateDispatcherProfile(
    userId: string,
    data: ProfileDispatcher
) {
    return apiClient.put(
        BACKEND_ROUTES.dispatcher.profile(userId),
        data
    )
}
