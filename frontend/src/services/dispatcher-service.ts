import type { ProfileDispatcher } from "@/types/dispatcher.types"
import type { PaginatedResponse } from "@/types/type"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"


export const dispatcherService = {

    /**
     * Busca o perfil completo do despachante
     */
    getDispatcherProfile(dispatcherId: number) {
        return apiClient.get<ProfileDispatcher>(BACKEND_ROUTES.dispatcher.getById(dispatcherId))
    },

    /**
     * Atualiza o perfil completo do despachante
     */
    updateDispatcherProfile(userId: number, data: ProfileDispatcher) {
        return apiClient.put(BACKEND_ROUTES.dispatcher.profile(userId), data)
    },

    /**
     * Realiza a busca de despachantes no backend com base na query informada.
     */
    searchDispatchers(query: string) {
        return apiClient.get<PaginatedResponse<ProfileDispatcher>>(
            BACKEND_ROUTES.dispatcher.search, { query }
        );

    },
}

