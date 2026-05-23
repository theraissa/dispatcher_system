import { ticketService } from "@/services/ticket-service";
import type { CreateTicketRequest, ListTicketUserResponse, TicketUserResponse } from "@/types/ticket.types";
import { useEffect, useState } from "react";

/**
 * Hook responsável por gerenciar chamados do usuário.
 *
 * Responsabilidades:
 * - Buscar chamados do usuário
 * - Criar novos chamados
 */
export function useTickets(userId: number) {
    const [tickets, setTickets] = useState<ListTicketUserResponse>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketUserResponse>();
    const [loading, setLoading] = useState(false);

    /**
     * Busca lista de chamados do usuário
     */
    async function fetchTickets() {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await ticketService.listTicketsByIdUser(userId);
            setTickets(response);

        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        } finally {
            setLoading(false);
        }
    }

    /**
     * Busca um chamado específico pelo ID
     */
    async function fetchTicketById(ticketId: number) {
        try {
            setLoading(true);
            const ticket = await ticketService.getTicketById(ticketId);
            setSelectedTicket(ticket);
            return ticket;

        } catch (error) {
            console.error("Erro ao buscar chamado:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    /**
     * Cria um chamado e atualiza lista
     */
    async function handleCreateTicket(data: CreateTicketRequest) {
        try {
            setLoading(true);
            await ticketService.createTicket(data);
            await fetchTickets();
        } catch (error) {
            console.error("Erro ao criar chamado:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTickets();
    }, [userId]);

    return {
        tickets,
        selectedTicket,
        loading,
        handleCreateTicket,
        fetchTicketById,
        refetch: fetchTickets
    };
}
