import { apiClient } from "./api-client";
import { BACKEND_ROUTES } from "../routes/backend-routes";
import type { TicketStatisticsDispatcher, CreateTicketRequest, ListTicketMessage, ListTicketUserResponse, TicketUserResponse, TicketMessage, TicketReview, ListTimelineResponse, CreateTimelineRequest, ListTicketReview, TicketReviewSummary } from "@/types/ticket.types";


/**
 * Busca um chamado pelo ID.
 */
export async function getTicketById(ticketId: number): Promise<TicketUserResponse> {
    return apiClient.get(BACKEND_ROUTES.tickets.getTicketById(ticketId));
}
/**
 * Lista os chamados do usuário pelo seu ID.
 */
export async function listTicketsByIdUser(userId: number): Promise<ListTicketUserResponse> {
    return apiClient.get(BACKEND_ROUTES.tickets.listTicketsByUser(userId));
}
/**
 * Cria um novo chamado no sistema.
 */
export async function createTicket(data: CreateTicketRequest) {
    return apiClient.post(BACKEND_ROUTES.tickets.createTicket, data);
}


/**
 * Lista as mensagens vinculadas aquele chamado.
 */
export async function getMessages(ticketId: number): Promise<ListTicketMessage> {
    return apiClient.get(BACKEND_ROUTES.tickets.listMessagesTicket(ticketId));
}
/**
 * Cria uma mensagem no chat do chamado.
 */
export async function createMessage(ticketId: number, data: {
    user_id: number; message: string;
}): Promise<TicketMessage> {
    return apiClient.post(BACKEND_ROUTES.tickets.createMessageTicket(ticketId), data);
}


/**
 * Obtém a média das avaliações recebidas pelo despachante.
 */
export async function getReviewSummaryDispatcher(userId: number): Promise<TicketReviewSummary> {
    return apiClient.get(BACKEND_ROUTES.tickets.getReviewSummary(userId))
}
/**
 * Lista as avalições do usuário despachante pelo o ID do seu usuário.
 */
export async function listReviewsDispatcher(userId: number): Promise<ListTicketReview> {
    return apiClient.get(BACKEND_ROUTES.tickets.listReviews(userId));
}
/**
 * Cria um review ao final do chamado para o despachante.
 */
export async function createReview(ticketId: number, data: {
    user_id: number; rating: number; comment?: string;
}): Promise<TicketReview> {
    return apiClient.post(BACKEND_ROUTES.tickets.createReviewTicket(ticketId), data);
}


/**
 * Lista os timeline do chamado pelo seu ID.
 */
export async function listTimelineByIdTicket(ticketId: number): Promise<ListTimelineResponse> {
    return apiClient.get(BACKEND_ROUTES.tickets.listTimelineTicket(ticketId));
}
/**
 * Cria um novo timeline para o chamado.
 */
export async function createTimelineByTicket(ticketId: number, data: CreateTimelineRequest) {
    return apiClient.post(BACKEND_ROUTES.tickets.createTimelineTicket(ticketId), data);
}


/**
 * Obtém as estáticas dos chamados do despachante.
 */
export async function getDispatcherTicketStatistics(userId: number): Promise<TicketStatisticsDispatcher> {
    return apiClient.get(BACKEND_ROUTES.tickets.getTicketStatistics(userId))
}
