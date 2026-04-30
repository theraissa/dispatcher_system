import { useAuth } from "@/hooks/auth/use-auth"
import { useNavigate } from "react-router-dom"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"
import { logoutRequest } from "../services/logout-request"

/**
 * Hook responsável pelo logout do usuário.
 *
 * Responsabilidades:
 * - Notificar backend para invalidar o token (blacklist Redis)
 * - Limpar estado global de autenticação
 * - Redirecionar usuário para tela inicial
 */
export function useLogout() {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    async function logout() {
        try {
            /**
             * Invalida o token no backend
             */
            await logoutRequest()
        } catch (error) {
            console.error("Erro ao invalidar token no servidor:", error)
        } finally {
            /**
             * Limpa estado global + localStorage
             */
            signOut()

            /**
             * Redireciona para página inicial do sistema.
             */
            navigate(FRONTEND_ROUTES.HOME)
        }
    }

    return { logout }
}
