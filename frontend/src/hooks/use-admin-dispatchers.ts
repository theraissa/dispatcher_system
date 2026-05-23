import { adminService } from "@/services/admin-service";
import type { ListDispatcherAdmin, StatusType } from "@/types/admin.type";
import { useEffect, useState } from "react";


/*
 * Hook para gerenciar despachantes no admin.
 */
export function useAdminDispatchers() {
    const [dispatchers, setDispatchers] = useState<ListDispatcherAdmin>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Carrega despachantes (por padrão: pending)
     */
    const loadDispatchers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingDispatchers();
            setDispatchers(response);
        } catch (err) {
            console.error("Erro ao carregar despachantes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDispatchers();
    }, []);

    /**
     * Atualiza o status de um despachante
     */
    const updateStatus = async (
        id: number,
        status: StatusType
    ) => {
        try {
            await adminService.updateStatusDispatcher(id, { status });

            // Como a lista é de "pending", remove da tela
            setDispatchers((prev) => prev.filter((d) => d.id !== id));

        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    return {
        dispatchers,
        loading,
        updateStatus,
        refresh: loadDispatchers
    };
}
