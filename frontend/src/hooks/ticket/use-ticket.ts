import { ticketService } from "@/services/ticket-service";
import type { CreateTicketRequest, ListTicketResponse, TicketUserResponse } from "@/types/ticket.types";
import type { PaginatedResponse } from "@/types/type";
import { useCallback, useEffect, useState } from "react";


type PaginationMetadata = Omit<PaginatedResponse<ListTicketResponse>, "items">;

/**
 * Hook responsável por gerenciar chamados do usuário.
 *
 * Responsabilidades:
 * - Buscar chamados do usuário
 * - Criar novos chamados
 */
export function useTickets(userId: number) {
    const [tickets, setTickets] = useState<ListTicketResponse[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketUserResponse>();
    const [loading, setLoading] = useState(false);
    const [ticketPagination, setTicketPagination] = useState<PaginationMetadata>({
        page: 1,
        per_page: 10,
        total: 0,
        pages: 0,
    })

    /**
     * Busca lista de chamados do usuário
     */
    const fetchTickets = useCallback(async (page = 1, per_page = 10) => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await ticketService.listTicketsByIdUser(
                userId,
                page,
                per_page
            );
            setTickets(response.items);
            setTicketPagination({
                page: response.page,
                per_page: response.per_page,
                total: response.total,
                pages: response.pages,
            });

        } catch (error) {
            console.error("Erro ao buscar chamados:", error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

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
        ticketPagination,
        handleCreateTicket,
        fetchTicketById,
        refetch: fetchTickets
    };
}
