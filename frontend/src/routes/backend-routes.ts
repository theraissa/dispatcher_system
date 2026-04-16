/**
 * Centraliza todas as rotas (endpoints) do backend utilizadas pela aplicação.
 *
 * Objetivo:
 * - Evitar strings hardcoded espalhadas pelo código
 * - Facilitar manutenção (ex: mudança de base URL)
 * - Padronizar construção de endpoints dinâmicos
 */


/**
 * Mapa de rotas relacionadas ao backend.
 */
export const BACKEND_ROUTES = {
    auth: {
        login: `/login`,
        logout: `/logout`,
    },

    users: {
        updateById: (id: string) => `/user/${id}`,
        getById: (id: string) => `/user/${id}`,
        create: `/user`,
    },

    dispatcher: {
        getServiceDetailsById: (dispatcherId: number) =>
            `/dispatcher/${dispatcherId}/services`,
        createServiceDetails: (dispatcherId: number, serviceId: number) =>
            `/dispatcher/${dispatcherId}/service/${serviceId}`,
        deleteServiceDetails: (dispatcherId: number, serviceId: number) =>
            `/dispatcher/${dispatcherId}/service/${serviceId}`,
        updateServiceDetails: (dispatcherId: number, serviceId: number) =>
            `/dispatcher/${dispatcherId}/service/${serviceId}`,

        profile: (userId: number) => `/dispatcher/${userId}`,
        getById: (dispatcherId: number) => `/dispatcher/${dispatcherId}`,
        create: `/dispatcher`,
        search: `/dispatcher/search`,
    },

    service: {
        list: `/admin/service`,
    },

    tickets: {
        createTicket: `/ticket`,
        listTicketsByUser: (userId: number) => `/ticket/user/${userId}`,
        listTicketsByDispatcher: (dispatcherId: number) => `/ticket/dispatcher/${dispatcherId}`,
        getTicketById: (ticketId: number) => `/ticket/${ticketId}`,

        listMessagesTicket: (ticketId: number) => `/ticket/${ticketId}/messages`,
        createMessageTicket: (ticketId: number) => `/ticket/${ticketId}/messages`,

        createReviewTicket: (ticketId: number) => `/ticket/${ticketId}/review`,

        listTimelineTicket: (ticketId: number) => `/ticket/${ticketId}/timeline`,
        createTimelineTicket: (ticketId: number) => `/ticket/${ticketId}/timeline`,
    },

    admin: {
        listPending: `/admin/dispatchers?status=pending`,
        updateStatusDispatcher: (dispatcherId: number) => `/admin/dispatcher/${dispatcherId}/status`,

        listServices: `/admin/service`,
        createService: `/admin/service`,
        updateService: (id: number) => `/admin/service/${id}`,
        deleteService: (id: number) => `/admin/service/${id}`,
    },
}
