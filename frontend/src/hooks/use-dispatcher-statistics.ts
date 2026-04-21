import { getDispatcherTicketStatistics } from "@/services/ticket-service";
import type { TicketStatisticsDispatcher } from "@/types/ticket.types";
import { useEffect, useState } from "react";


/**
 * Hook responsável por buscar e gerenciar as estatísticas do despachante.
 *
 * Responsabilidades:
 * - Buscar dados de desempenho do despachante no backend
 * - Controlar o estado de carregamento da requisição
 * - Armazenar os dados para consumo na UI (dashboard)
 *
 * @param userId ID do usuário despachante
 *
 * @returns
 * - statistics → objeto com as métricas do despachante
 * - loading → indica se os dados estão sendo carregados
 */
export function useDispatcherStatistics(userId: number) {

    // Estado que armazena as estatísticas retornadas pelo backend
    const [statistics, setStatistics] = useState<TicketStatisticsDispatcher>();

    // Estado de controle de carregamento da requisição
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;

        /**
         * Função responsável por buscar os dados no backend.
         */
        async function fetchStats() {
            try {
                setLoading(true);

                // Chamada ao serviço que retorna as estatísticas
                const response = await getDispatcherTicketStatistics(userId);

                // Atualiza o estado com os dados recebidos
                setStatistics(response);
            } catch (error) {
                console.error("Erro ao buscar estatísticas do despachante:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [userId]);

    return {
        statistics,
        loading,
    };
}
