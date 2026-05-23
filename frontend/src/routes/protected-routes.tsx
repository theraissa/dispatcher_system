import { useAuth } from "@/hooks/auth/use-auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FRONTEND_ROUTES } from "./frontend-routes";

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
 *
 * Exemplo:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 */
export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={FRONTEND_ROUTES.HOME} replace state={{ from: location }} />;
    }

    return <Outlet />;
}

