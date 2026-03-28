/**
 * Rotas da aplicação (frontend).
 *
 * Centraliza todos os caminhos usados no React Router
 * e navegação via useNavigate / Link.
 */
export const FRONTEND_ROUTES = {
    HOME: "/",
    LOGIN: "/login",

    REGISTER: {
        CLIENT: "/register/client",
        DISPATCHER: "/register/dispatcher",
    },

    INITIAL: {
        SEARCH_DISPATCHER: "/initial/client/search-dispatcher",
        DISPATCHER_PROFILE: "/initial/dispatcher/profile",
    },

    ADMIN: {
        ROOT: "/admin",
        DISPATCHERS: "/admin/dispatcher",
        SERVICES: "/admin/services",
    },
}
