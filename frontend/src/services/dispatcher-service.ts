import type { ProfileDispatcher } from "@/types/dispatcher.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"

/**
 * Busca o perfil completo do despachante
 */
export async function getDispatcherProfile(dispatcherId: number) {
    const response = await apiClient.get<ProfileDispatcher>(
        BACKEND_ROUTES.dispatcher.getById(dispatcherId)
    )
    return response
}

/**
 * Atualiza o perfil completo do despachante
 */
export async function updateDispatcherProfile(
    userId: number,
    data: ProfileDispatcher
) {
    return apiClient.put(
        BACKEND_ROUTES.dispatcher.profile(userId), data)
}
