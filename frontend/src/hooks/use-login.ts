import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../services/login-request"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"
import type { LoginRequest } from "../types/type"

/**
 * Hook responsável pelo fluxo de autenticação do usuário.
 */
export function useLogin() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function login(data: LoginRequest) {
        try {
            setLoading(true)
            setError("")

            const user = await loginRequest(data)

            localStorage.setItem("user", JSON.stringify(user))

            if (user.role === "dispatcher") {
                navigate(FRONTEND_ROUTES.INITIAL.DISPATCHER_PROFILE)
            } else {
                navigate(FRONTEND_ROUTES.INITIAL.SEARCH_DISPATCHER)
            }
        } catch (err: any) {
            setError(err.message)
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
