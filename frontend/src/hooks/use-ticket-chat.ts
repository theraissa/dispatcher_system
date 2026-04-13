import { useEffect, useState } from "react";
import { getMessages, createMessage } from "@/services/ticket-service";
import type { ListTicketMessage } from "@/types/ticket.types";


/**
 * Hook responsável por gerenciar o chat de um chamado.
 *
 * Responsabilidades:
 * - Buscar mensagens de um chamado específico
 * - Armazenar mensagens em estado local
 * - Enviar novas mensagens
 * - Atualizar a lista de mensagens após envio
 *
 * @param ticketId ID do chamado (usado para buscar e enviar mensagens)
 * @param userId ID do usuário autenticado (autor das mensagens)
 *
 * @returns {
 *   messages: Lista de mensagens do chamado
 *   loading: Estado de carregamento inicial
 *   handleSend: Função para envio de mensagens
 * }
 */
export function useTicketChat(ticketId: number, userId: number) {

    // Lista de mensagens do chamado.
    const [messages, setMessages] = useState<ListTicketMessage>([]);

    //Indica se as mensagens ainda estão sendo carregadas.
    const [loading, setLoading] = useState(true);

    // Busca todas as mensagens do chamado no backend.
    async function fetchMessages() {
        try {
            const data = await getMessages(ticketId);
            setMessages(data);
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Envia uma nova mensagem para o chamado.
     *
     * Após o envio:
     * - A mensagem retornada pela API é adicionada ao estado local
     *
     * @param message Conteúdo da mensagem enviada pelo usuário
     */
    async function handleSend(message: string) {
        try {
            const newMsg = await createMessage(ticketId, {
                user_id: userId,
                message
            });

            // Atualização otimista simples (append da nova mensagem)
            setMessages(prev => [...prev, newMsg]);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }

    // EFEITO: CARREGAMENTO INICIAL
    useEffect(() => {
        if (!ticketId) return;
        fetchMessages();
    }, [ticketId]);


    return {
        messages,
        loading,
        handleSend
    };
}
