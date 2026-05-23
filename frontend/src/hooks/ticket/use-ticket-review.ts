import { ticketService } from "@/services/ticket-service";
import { useState } from "react";


/**
 * Hook responsável por gerenciar o envio de avaliações (reviews) de um chamado.
 *
 * Responsabilidades:
 * - Enviar a avaliação do usuário para o backend
 * - Controlar o estado de carregamento durante a requisição
 *
 * Parâmetros:
 * @param ticketId - Identificador do chamado avaliado
 * @param userId - Identificador do usuário que está enviando a avaliação
 *
 * Retorno:
 * - loading → indica se a requisição está em andamento
 * - handleSubmit → função para envio da avaliação
 *
 * Fluxo de envio:
 * 1. Ativa estado de loading
 * 2. Chama o serviço `createReview`
 * 3. Finaliza loading independentemente de sucesso ou erro
 *
 */
export function useTicketReview(ticketId: number, userId: number) {

    // Estado que indica se a avaliação está sendo enviada.
    const [loading, setLoading] = useState(false);

    /**
     * Envia a avaliação do usuário para o backend.
     *
     * @param rating - Nota atribuída (1 a 5)
     * @param comment - Comentário opcional
     *
     * @returns Promise<boolean> - Retorna true em caso de sucesso
     */
    async function handleSubmit({ rating, comment }: {
        rating: number; comment?: string;
    }): Promise<boolean> {
        try {
            setLoading(true);

            await ticketService.createReview(ticketId, {
                user_id: userId,
                rating,
                comment,
            });

            return true;
        } finally {
            setLoading(false);
        }
    }

    return {
        loading,
        handleSubmit,
    };
}
