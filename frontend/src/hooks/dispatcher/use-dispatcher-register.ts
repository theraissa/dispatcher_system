import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FRONTEND_ROUTES } from "../../routes/frontend-routes"
import { registerUser } from "../../services/register-user"
import type { RegisterDispatcherRequest, RegisterDispatcherResponse } from "../../types/dispatcher.types"
import type { ApiError } from "../../types/type"


/**
 * Hook responsável pelo cadastro de despachantes.
 *
 * Responsabilidades:
 * - Validar dados do formulário
 * - Transformar payload para API
 * - Executar cadastro
 * - Controlar loading e erro
 * - Redirecionar após sucesso
 */
export function useRegisterDispatcher() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Executa o cadastro do despachante
     */
    async function register(
        formData: RegisterDispatcherRequest
    ): Promise<RegisterDispatcherResponse | null> {
        try {
            setLoading(true)
            setError(null)

            // validação de senha
            if (formData.user.password !== formData.user.confirm_password) {
                throw new Error("As senhas não coincidem")
            }

            const result = await registerUser.registerDispatcher(formData)

            // redirecionamento após sucesso
            navigate(FRONTEND_ROUTES.LOGIN)
            return result

        } catch (err: unknown) {
            const error = err as ApiError
            setError(error?.message || "Erro ao cadastrar despachante")
            return null
        } finally {
            setLoading(false)
        }
    }
    return {
        register,
        loading,
        error
    }
}
