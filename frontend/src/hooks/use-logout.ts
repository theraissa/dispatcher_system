import { useAuth } from "@/hooks/auth/use-auth";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";


/**
 * Hook responsável pelo logout do usuário.
 *
 * Responsabilidades:
 * - Revogar token JWT no backend
 * - Limpar sessão local
 * - Redirecionar usuário
 */
export function useLogout() {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    /**
     * Finaliza sessão do usuário.
     */
    async function logout() {

        try {
            // Solicita invalidação do token no backend.
            await authService.logoutRequest();

        } catch (error) {
            /**
             * Mesmo se backend falhar,
             * sessão local ainda deve ser encerrada.
             */
            console.error("Erro ao invalidar token:", error);
        } finally {
            // Limpa estado global e localStorage.
            signOut();
            // Retorna usuário para tela inicial.
            navigate(FRONTEND_ROUTES.HOME);
        }
    }

    return {
        logout,
    };
}
