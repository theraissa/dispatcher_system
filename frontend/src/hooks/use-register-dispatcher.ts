import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { RegisterDispatcherRequest } from "../types/dispatcher.types"
import { registerDispatcher } from "../services/register-dispatcher"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"

/**
 * Hook responsável pelo cadastro de despachante.
 */
export function useRegisterDispatcher() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function register(formData: RegisterDispatcherRequest) {
        try {
            setLoading(true)
            setError("")

            if (formData.user.password !== formData.user.confirm_password) {
                throw new Error("As senhas não coincidem")
            }

            const { confirm_password, ...userWithoutConfirm } = formData.user

            const payload = {
                ...formData,
                user: userWithoutConfirm
            }

            await registerDispatcher(payload)

            navigate(FRONTEND_ROUTES.INITIAL.DISPATCHER_PROFILE)
        } catch (err: any) {
            setError(err.message)
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
