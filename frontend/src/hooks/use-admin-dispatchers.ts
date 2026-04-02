import { useState, useEffect } from "react";
import { adminService } from "../services/admin-service";


/*
 * Hook personalizado para gerenciar a lista de despachantes pendentes no painel administrativo.
 * Fornece funções para aprovar ou rejeitar despachantes, além de um método para recarregar a lista.
 */
export function useAdminDispatchers() {
    const [dispatchers, setDispatchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Função para carregar os despachantes pendentes do backend
    const loadDispatchers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPendingDispatchers();
            setDispatchers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDispatchers(); }, []);

    // Função para aprovar um despachante, que também atualiza a lista localmente
    const approve = async (id: number) => {
        await adminService.approveDispatcher(id);
        setDispatchers(prev => prev.filter(d => d.id !== id));
    };

    // Função para rejeitar um despachante, que também atualiza a lista localmente
    const reject = async (id: number) => {
        await adminService.rejectDispatcher(id);
        setDispatchers(prev => prev.filter(d => d.id !== id));
    };

    return { dispatchers, loading, approve, reject, refresh: loadDispatchers };
}
