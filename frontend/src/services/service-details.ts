import type { ServiceDetails, ServiceResponse } from "@/types/service.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"
import type { MessageResponse } from "@/types/type"


/**
 * Busca catálogo global de serviços
 */
export async function getAllServices(): Promise<ServiceResponse[]> {
    return apiClient.get<ServiceResponse[]>(
        BACKEND_ROUTES.service.list
    )
}

/**
 * Busca os serviços detalhados do despachante pelo seu ID.
 */
export async function getServiceDetailsDispatcher(dispatcherId: number): Promise<ServiceDetails[]> {
    return apiClient.get<ServiceDetails[]>(
        BACKEND_ROUTES.dispatcher.getServiceDetailsById(dispatcherId)
    )
}

/**
 * Cria um serviço detalhado e vincula ao despachante.
 */
export async function createServiceDetailsDispatcher(dispatcherId: number, serviceId: number): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>(
        BACKEND_ROUTES.dispatcher.createServiceDetails(dispatcherId, serviceId)
    )
}

/**
 * Atualiza o preço de um serviço detalhado.
 */
export async function updateServiceDetailsDispatcher(
    dispatcherId: number,
    serviceId: number,
    price: number,
): Promise<MessageResponse> {
    return apiClient.put<MessageResponse>(
        BACKEND_ROUTES.dispatcher.updateServiceDetails(dispatcherId, serviceId), { price }
    );
}

/**
 * Remove um serviço detalhado do despachante.
 */
export async function removeDispatcherServiceDetails(dispatcherId: number, serviceId: number): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(
        BACKEND_ROUTES.dispatcher.deleteServiceDetails(dispatcherId, serviceId)
    );
}
