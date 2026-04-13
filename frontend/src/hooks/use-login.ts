import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../services/login-request"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"
import type { LoginRequest } from "../types/type"
import { useAuth } from "@/hooks/use-auth"

/**
 * Hook responsável pelo fluxo de autenticação do usuário.
 *
 * Responsabilidades:
 * - Executar login no backend
 * - Armazenar dados no contexto global (AuthProvider)
 * - Redirecionar usuário conforme o papel (role)
 */
export function useLogin() {
    const navigate = useNavigate()
    const { signIn } = useAuth()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function login(data: LoginRequest) {
        try {
            setLoading(true)
            setError("")

            const user = await loginRequest(data)

            /**
             * Atualiza estado global + localStorage via AuthProvider
             */
            signIn(
                {
                    id: user.id,
                    dispatcherId: user.dispatcherId,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                user.token
            )

            /**
             * Redirecionamento baseado no role
             */
            if (user.role.dispatcher === "dispatcher") {
                navigate(FRONTEND_ROUTES.INITIAL.DISPATCHER_PROFILE)
            } else {
                navigate(FRONTEND_ROUTES.INITIAL.SEARCH_DISPATCHER)
            }

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Erro inesperado")
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        login,
        loading,
        error
    }
}
