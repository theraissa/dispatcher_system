import { ClipboardList, User, Search } from "lucide-react";

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
        DISPATCHER_PROFILE: "/dispatcher/profile",
        CALLED: "/dispatcher/called",
        CALLED_DETAILS: "/dispatcher/called-details/:ticketId",
    },

    CLIENT: {
        PROFILE: "/client/profile",
        SEARCH_DISPATCHER: "/client/search-dispatcher",
        CALLED: "/client/called",
        CALLED_DETAILS: "/client/called-details/:ticketId",
        CARD_PROFILE_DISPATCHER: "/client/profile-dispatcher/:userId",
    },

    ADMIN: {
        ROOT: "/admin",
        DISPATCHERS: "/admin/dispatcher",
        SERVICES: "/admin/services",
    },
}

/**
 * Links de navegação para o cliente, usados no NavbarPage.
 * Cada link tem um rótulo, caminho e ícone associado.
 */
export const clientLinksNavbar = [
    { label: "Buscar Despachantes", path: "/client/search-dispatcher", icon: Search },
    { label: "Chamados", path: "/client/called", icon: ClipboardList },
    { label: "Perfil", path: "/client/profile", icon: User },
];


/**
 * Links de navegação para o despachante, usados no NavbarPage.
 * Cada link tem um rótulo, caminho e ícone associado.
 */
export const dispatcherLinksNavbar = [
    { label: "Chamados", path: "/dispatcher/called", icon: ClipboardList },
    { label: "Perfil", path: "/dispatcher/profile", icon: User },
];
