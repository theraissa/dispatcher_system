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

    INITIAL: {
        SEARCH_DISPATCHER: "/client/search-dispatcher",
        DISPATCHER_PROFILE: "/dispatcher/profile",
    },

    CLIENT: {
        PROFILE: "/client/profile",
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
    { label: "Buscar Despachante", path: "/client/search-dispatcher", icon: Search },
    { label: "Meus Chamados", path: "/client/called", icon: ClipboardList },
    { label: "Meu Perfil", path: "/client/profile", icon: User },
];


/**
 * Links de navegação para o despachante, usados no NavbarPage.
 * Cada link tem um rótulo, caminho e ícone associado.
 */
export const dispatcherLinksNavbar = [
    { label: "Meu Perfil", path: "/dispatcher/profile", icon: User },
];
