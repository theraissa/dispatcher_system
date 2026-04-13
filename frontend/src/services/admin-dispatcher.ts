import { BACKEND_ROUTES } from "@/routes/backend-routes";
import { apiClient } from "./api-client";
import type { ListDispatcherAdmin } from "@/types/admin.type";



/**
 * Obtém todos os despachante com o status pendente.
 */
export async function getPendingDispatchers(): Promise<ListDispatcherAdmin> {
    return apiClient.get(BACKEND_ROUTES.admin.listPending);
}

/**
 * Atualiza o status do cadastro do despachante.
 */
export async function updateStatusDispatcher(dispatcherId: number, status: Record<string, string>) {
    return apiClient.put(BACKEND_ROUTES.admin.updateStatusDispatcher(dispatcherId), status)
}
