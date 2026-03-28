import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { RegisterDispatcherRequest } from "../types/dispatcher.types"

/**
 * Cria um novo despachante no sistema.
 */
export async function registerDispatcher(data: RegisterDispatcherRequest): Promise<void> {
    return apiClient.post<void>(BACKEND_ROUTES.dispatcher.create, data)
}
