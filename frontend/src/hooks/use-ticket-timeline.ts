import { listTimelineByIdTicket } from "@/services/ticket-service";
import type { TimelineResponse } from "@/types/ticket.types";
import { useCallback, useEffect, useState } from "react";


/**
 * Hook responsável por buscar e gerenciar a timeline de um ticket.
 *
 * Responsabilidades:
 * - Buscar os eventos da timeline pelo ticketId
 * - Controlar estados de loading e erro
 * - Expor função de refetch manual
 *
 * @param ticketId ID do ticket a ser consultado
 */
export function useTicketTimeline(ticketId: number) {

    // Armazena os eventos da timeline
    const [data, setData] = useState<TimelineResponse[]>([]);
    // Controla o estado de carregamento da requisição
    const [loading, setLoading] = useState(false);
    // Armazena mensagem de erro (caso ocorra)
    const [error, setError] = useState<string | null>(null);

    /**
     * Função responsável por buscar os dados da API.
     */
    const fetchTimeline = useCallback(async () => {
        try {
            // Inicia estado de carregamento e limpa erro anterior
            setLoading(true);
            setError(null);

            // Chamada ao service (API)
            const response = await listTimelineByIdTicket(ticketId);

            // Atualiza os dados com a resposta
            setData(response);

        } catch (err: any) {
            setError(err?.message);
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    /**
     * Effect responsável por disparar a busca automaticamente
     * sempre que o ticketId mudar.
     */
    useEffect(() => {
        if (ticketId) {
            fetchTimeline();
        }
    }, [ticketId, fetchTimeline]);

    /**
     * Retorno do hook
     *
     * - data: dados da timeline
     * - loading: estado de carregamento
     * - error: erro da requisição
     * - refetch: permite recarregar manualmente
     */
    return {
        data,
        loading,
        error,
        refetch: fetchTimeline,
    };
}
