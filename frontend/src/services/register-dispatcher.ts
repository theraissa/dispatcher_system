import { apiClient } from "./api-client"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import type { RegisterDispatcherRequest, RegisterDispatcherResponse } from "../types/dispatcher.types"


/**
 * Cria um novo despachante no sistema.
 *
 * @param data Payload já tratado (sem confirm_password)
 * @returns IDs das entidades criadas
 */
export async function registerDispatcher(data: RegisterDispatcherRequest): Promise<RegisterDispatcherResponse> {
    return apiClient.post<RegisterDispatcherResponse>(BACKEND_ROUTES.dispatcher.create, data)
}


