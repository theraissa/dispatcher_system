import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/register-user"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"
import type { ApiError } from "../types/type"
import type { CreateUserRequest, UserResponse } from "@/types/user.types"


/**
 * Hook responsável pelo registro de usuários.
 *
 * Responsabilidades:
 * - Executar chamada de criação de usuário
 * - Controlar estado de loading
 * - Tratar erros da API
 * - Redirecionar após sucesso
 */
export function useRegisterUser() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Executa o registro do usuário
     *
     * @param data Dados do formulário de cadastro
     */
    async function register(data: CreateUserRequest): Promise<UserResponse | null> {
        try {
            setLoading(true)
            setError(null)

            const user = await registerUser(data)

            // redireciona após sucesso
            navigate(FRONTEND_ROUTES.LOGIN)

            return user
        } catch (err: unknown) {
            const error = err as ApiError

            setError(error?.message || "Erro ao registrar usuário")

            return null
        } finally {
            setLoading(false)
        }
    }

    return { register, loading, error }
}
