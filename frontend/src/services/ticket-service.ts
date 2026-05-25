import type { CreateTicketRequest, CreateTimelineRequest, ListTicketMessage, ListTicketResponse, ListTicketReview, ListTimelineResponse, TicketMessage, TicketReview, TicketReviewSummary, TicketStatisticsDispatcher, TicketUserResponse } from "@/types/ticket.types";
import type { PaginatedResponse } from "@/types/type";
import { BACKEND_ROUTES } from "../routes/backend-routes";
import { apiClient } from "./api-client";


export const ticketService = {

    /**
     * Busca um chamado pelo ID.
     */
    getTicketById(ticketId: number): Promise<TicketUserResponse> {
        return apiClient.get(BACKEND_ROUTES.tickets.getTicketById(ticketId));
    },
    /**
     * Lista os chamados do usuário pelo seu ID.
     */
    listTicketsByIdUser(userId: number, page: number, per_page: number) {
        return apiClient.get<PaginatedResponse<ListTicketResponse>>(
            BACKEND_ROUTES.tickets.listTicketsByUser(userId), { page, per_page }
        );
    },

    /**
     * Cria um novo chamado no sistema.
     */
    createTicket(data: CreateTicketRequest) {
        return apiClient.post(BACKEND_ROUTES.tickets.createTicket, data);
    },


    /**
     * Lista as mensagens vinculadas aquele chamado.
     */
    listMessages(ticketId: number): Promise<ListTicketMessage> {
        return apiClient.get(BACKEND_ROUTES.tickets.listMessagesTicket(ticketId));
    },
    /**
     * Cria uma mensagem no chat do chamado.
     */
    createMessage(ticketId: number, data: {
        user_id: number; message: string;
    }): Promise<TicketMessage> {
        return apiClient.post(BACKEND_ROUTES.tickets.createMessageTicket(ticketId), data);
    },


    /**
     * Obtém a média das avaliações recebidas pelo despachante.
     */
    getReviewSummaryDispatcher(userId: number): Promise<TicketReviewSummary> {
        return apiClient.get(BACKEND_ROUTES.tickets.getReviewSummary(userId))
    },
    /**
     * Lista as avalições do usuário despachante pelo o ID do seu usuário.
     */
    listReviewsDispatcher(userId: number): Promise<ListTicketReview> {
        return apiClient.get(BACKEND_ROUTES.tickets.listReviews(userId));
    },
    /**
     * Cria um review ao final do chamado para o despachante.
     */
    createReview(ticketId: number, data: {
        user_id: number; rating: number; comment?: string;
    }): Promise<TicketReview> {
        return apiClient.post(BACKEND_ROUTES.tickets.createReviewTicket(ticketId), data);
    },
    /**
     * Atualiza um review ao final do chamado para o despachante.
     */
    updateReview(ticketId: number, reviewId: number, data: {
        rating: number; comment?: string;
    }): Promise<TicketReview> {
        return apiClient.put(BACKEND_ROUTES.tickets.updateReviewTicket(ticketId, reviewId), data);
    },

    /**
     * Lista os timeline do chamado pelo seu ID.
     */
    listTimelineByIdTicket(ticketId: number): Promise<ListTimelineResponse> {
        return apiClient.get(BACKEND_ROUTES.tickets.listTimelineTicket(ticketId));
    },
    /**
     * Cria um novo timeline para o chamado.
     */
    createTimelineByTicket(ticketId: number, data: CreateTimelineRequest) {
        return apiClient.post(BACKEND_ROUTES.tickets.createTimelineTicket(ticketId), data);
    },


    /**
     * Obtém as estáticas dos chamados do despachante.
     */
    getDispatcherTicketStatistics(userId: number): Promise<TicketStatisticsDispatcher> {
        return apiClient.get(BACKEND_ROUTES.tickets.getTicketStatistics(userId))
    },
}
