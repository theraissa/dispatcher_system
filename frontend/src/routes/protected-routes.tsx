import { useAuth } from "@/hooks/auth/use-auth";
import type { RolePermission } from "@/types/type";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FRONTEND_ROUTES } from "./frontend-routes";

type ProtectedRouteProps = {
    allowedRoles?: RolePermission[];
};

/**
 * Componente responsável por proteger rotas da aplicação.
 *
 * Esse componente atua como um "guard" de autenticação,
 * garantindo que apenas usuários autenticados possam acessar
 * determinadas páginas.
 *
 * Funcionamento:
 * - Verifica se existe um usuário autenticado no contexto (`useAuth`).
 * - Caso NÃO exista:
 *   → Redireciona automaticamente para a tela de login (`/login`).
 * - Caso exista:
 *   → Permite o acesso à rota renderizando o conteúdo filho (`Outlet`).
 */
export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {

    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    /**
     * Usuário não autenticado
     */
    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to={FRONTEND_ROUTES.LOGIN}
                replace
                state={{ from: location }}
            />
        );
    }

    /**
     * Usuário autenticado mas sem permissão
     */
    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to={FRONTEND_ROUTES.HOME}
                replace
            />
        );
    }

    return <Outlet />;
}
