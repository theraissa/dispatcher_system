import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";

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
 * <Route element={<ProtectedRoutes />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 *
 */
export default function ProtectedRoutes() {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
