import { ClipboardList, Home, Search, User } from "lucide-react";

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

    DISPATCHER: {
        INITIAL: "/dispatcher/initial",
        PROFILE: "/dispatcher/profile",
        TICKET: "/dispatcher/tickets",
        TICKET_DETAILS: "/dispatcher/ticket-details/:ticketId",
    },

    CLIENT: {
        PROFILE: "/client/profile",
        SEARCH_DISPATCHER: "/client/search-dispatcher",
        TICKET: "/client/tickets",
        TICKET_DETAILS: "/client/ticket-details/:ticketId",
        CARD_PROFILE_DISPATCHER: "/client/profile-dispatcher/:userId",
    },

    ADMIN: {
        INITIAL: "/admin",
        DISPATCHERS: "/admin/dispatcher",
        SERVICES: "/admin/services",
    },
}

/**
 * Links de navegação para o cliente, usados no NavbarPage.
 * Cada link tem um rótulo, caminho e ícone associado.
 */
export const clientLinksNavbar = [
    { label: "Buscar Despachantes", path: FRONTEND_ROUTES.CLIENT.SEARCH_DISPATCHER, icon: Search },
    { label: "Chamados", path: FRONTEND_ROUTES.CLIENT.TICKET, icon: ClipboardList },
    { label: "Perfil", path: FRONTEND_ROUTES.CLIENT.PROFILE, icon: User },
];


/**
 * Links de navegação para o despachante, usados no NavbarPage.
 * Cada link tem um rótulo, caminho e ícone associado.
 */
export const dispatcherLinksNavbar = [
    { label: "Início", path: FRONTEND_ROUTES.DISPATCHER.INITIAL, icon: Home },
    { label: "Chamados", path: FRONTEND_ROUTES.DISPATCHER.TICKET, icon: ClipboardList },
    { label: "Perfil", path: FRONTEND_ROUTES.DISPATCHER.PROFILE, icon: User },
];
