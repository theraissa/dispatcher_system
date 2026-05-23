import type { ServiceDetails, ServiceResponse } from "@/types/service.types"
import type { MessageResponse } from "@/types/type"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"

export const serviceDetailsDispatcher = {

    /**
     * Busca catálogo global de serviços
     */
    getAllServices(): Promise<ServiceResponse[]> {
        return apiClient.get<ServiceResponse[]>(
            BACKEND_ROUTES.service.list
        )
    },

    /**
     * Busca os serviços detalhados do despachante pelo seu ID.
     */
    getServiceDetailsDispatcher(dispatcherId: number): Promise<ServiceDetails[]> {
        return apiClient.get<ServiceDetails[]>(
            BACKEND_ROUTES.dispatcher.getServiceDetailsById(dispatcherId)
        )
    },
    /**
     * Cria um serviço detalhado e vincula ao despachante.
     */
    createServiceDetailsDispatcher(dispatcherId: number, serviceId: number): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>(
            BACKEND_ROUTES.dispatcher.createServiceDetails(dispatcherId, serviceId)
        )
    },
    /**
     * Atualiza o preço de um serviço detalhado.
     */
    updateServiceDetailsDispatcher(
        dispatcherId: number,
        serviceId: number,
        price: number,
    ): Promise<MessageResponse> {
        return apiClient.put<MessageResponse>(
            BACKEND_ROUTES.dispatcher.updateServiceDetails(dispatcherId, serviceId), { price }
        );
    },
    /**
     * Remove um serviço detalhado do despachante.
     */
    removeDispatcherServiceDetails(dispatcherId: number, serviceId: number): Promise<MessageResponse> {
        return apiClient.delete<MessageResponse>(
            BACKEND_ROUTES.dispatcher.deleteServiceDetails(dispatcherId, serviceId)
        );
    },
}
