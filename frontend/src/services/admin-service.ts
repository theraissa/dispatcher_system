import { BACKEND_ROUTES } from "@/routes/backend-routes";
import { apiClient } from "./api-client"; 


export const adminService = {
    async getPendingDispatchers() {
        const response = await apiClient.get(BACKEND_ROUTES.admin.listPending);
        return response;
    },

    async approveDispatcher(id: number) {
        await apiClient.post(BACKEND_ROUTES.admin.approve(id));
    },

    async rejectDispatcher(id: number) {
        await apiClient.post(BACKEND_ROUTES.admin.reject(id));
    }
};
