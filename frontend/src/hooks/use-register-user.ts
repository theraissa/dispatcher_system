import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../services/register-user"
import { FRONTEND_ROUTES } from "../routes/frontend-routes"

/**
 * Hook responsável pelo registro do usuário.
 */
export function useRegisterUser() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function register(data: any) {
        try {
            setLoading(true)
            setError("")

            await registerUser(data)

            navigate(FRONTEND_ROUTES.INITIAL.SEARCH_DISPATCHER)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { register, loading, error }
}
