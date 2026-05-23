import { BACKEND_ROUTES } from "@/routes/backend-routes";
import type { ListDispatcherAdmin } from "@/types/admin.type";
import type { CreateServiceRequest, ServiceResponse } from "@/types/service.types";
import { apiClient } from "./api-client";


export const adminService = {

    // Serviços (CRUD)
    listServices(): Promise<ServiceResponse[]> {
        const response = apiClient.get<ServiceResponse[]>(BACKEND_ROUTES.admin.listServices);
        return response;
    },

    // Criar novo serviço
    createService(data: CreateServiceRequest): Promise<ServiceResponse> {
        return apiClient.post<ServiceResponse>(BACKEND_ROUTES.admin.createService, data);
    },

    // Atualizar serviço existente
    updateService(id: number, data: CreateServiceRequest): Promise<ServiceResponse> {
        return apiClient.put<ServiceResponse>(BACKEND_ROUTES.admin.updateService(id), data);
    },

    // Deletar serviço
    deleteService(id: number) {
        apiClient.delete(BACKEND_ROUTES.admin.deleteService(id));
    },

    /**
     * Obtém todos os despachante com o status pendente.
     */
    getPendingDispatchers(): Promise<ListDispatcherAdmin> {
        return apiClient.get(BACKEND_ROUTES.admin.listPending);
    },

    /**
     * Atualiza o status do cadastro do despachante.
     */
    updateStatusDispatcher(dispatcherId: number, status: Record<string, string>) {
        return apiClient.put(BACKEND_ROUTES.admin.updateStatusDispatcher(dispatcherId), status)
    },

};
