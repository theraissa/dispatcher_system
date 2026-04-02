import { BACKEND_ROUTES } from "@/routes/backend-routes";
import { apiClient } from "./api-client";
import type { CreateServiceRequest, ServiceResponse } from "@/types/service.types";

/*
* Serviço para operações administrativas, como aprovação de despachantes e gerenciamento de serviços.
 */
export const adminService = {

    // Despachantes Pendentes
    async getPendingDispatchers() {
        const response = await apiClient.get(BACKEND_ROUTES.admin.listPending);
        return response;
    },

    // Aprovar ou Rejeitar Despachantes
    async approveDispatcher(id: number) {
        await apiClient.post(BACKEND_ROUTES.admin.approve(id));
    },

    // Rejeitar Despachante
    async rejectDispatcher(id: number) {
        await apiClient.post(BACKEND_ROUTES.admin.reject(id));
    },

    // Serviços (CRUD)
    async listServices(): Promise<ServiceResponse[]> {
        // Tipamos o get para saber que retorna um array de serviços
        const response = await apiClient.get<ServiceResponse[]>(BACKEND_ROUTES.admin.listServices);
        return response;
    },

    // Criar novo serviço
    async createService(data: CreateServiceRequest): Promise<ServiceResponse> {
        return await apiClient.post<ServiceResponse>(BACKEND_ROUTES.admin.createService, data);
    },

    // Atualizar serviço existente
    async updateService(id: number, data: CreateServiceRequest): Promise<ServiceResponse> {
        return await apiClient.put<ServiceResponse>(BACKEND_ROUTES.admin.updateService(id), data);
    },

    // Deletar serviço
    async deleteService(id: number) {
        await apiClient.delete(BACKEND_ROUTES.admin.deleteService(id));
    },
};
