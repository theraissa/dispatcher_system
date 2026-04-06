import type { ServiceDetail } from "@/types/service.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"



/**
 * Busca os serviços do despachante
 */
export async function getDispatcherServices(userId: number) {
    return apiClient.get<ServiceDetail[]>(
        BACKEND_ROUTES.dispatcher.services(userId)
    )
}

/**
 * Busca catálogo global de serviços
 */
export async function getAllServices() {
    return apiClient.get<ServiceDetail[]>(
        BACKEND_ROUTES.service.list
    )
}

/**
 * Remove um serviço do despachante
 */
export async function removeDispatcherService(
    userId: number,
    serviceId: number
) {
    return apiClient.delete(
        BACKEND_ROUTES.dispatcher.removeService(userId, serviceId)
    )
}

/**
 * Adiciona um serviço ao despachante
 */
export async function addDispatcherService(
    userId: number,
    serviceId: number
) {
    return apiClient.post(
        BACKEND_ROUTES.dispatcher.addService(userId, serviceId)
    )
}


/**
 * Atualiza o preço de um serviço
 */
export async function updateDispatcherService(
    userId: number,
    serviceId: number,
    price: number
) {
    return apiClient.put(
        BACKEND_ROUTES.dispatcher.updateService(userId, serviceId),
        { price }
    )
}
