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
    },

    users: {
        updateById: (id: string) => `/user/${id}`,
        getById: (id: string) => `/user/${id}`,
        create: `/user`,
    },

    dispatcher: {
        services: (userId: number) => `/dispatcher/${userId}/services`,
        addService: (userId: number, serviceId: number) =>
            `/dispatcher/${userId}/service/${serviceId}`,
        removeService: (userId: number, serviceId: number) =>
            `/dispatcher/${userId}/service/${serviceId}`,
        updateService: (userId: number, serviceId: number) =>
            `/dispatcher/${userId}/service/${serviceId}`,
        profile: (userId: string) => `/dispatcher/${userId}`,
        getById: (id: string) => `/dispatcher/${id}`,
        create: `/dispatcher`,
        search: `/dispatcher/search`,
    },

    service: {
        list: `/admin/service`,
    },

    admin: {
        listPending: `/admin/dispatchers?status=pending`,
        approve: (id: number) => `/admin/dispatcher/${id}/approve`,
        reject: (id: number) => `/admin/dispatcher/${id}/reject`,

        listServices: `/admin/service`,
        createService: `/admin/service`,
        updateService: (id: number) => `/admin/service/${id}`,
        deleteService: (id: number) => `/admin/service/${id}`,
    },
}
