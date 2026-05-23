import { useAuth } from "@/hooks/auth/use-auth";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { loginRequest } from "@/services/login-request";
import type { LoginRequest } from "@/types/type";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook responsável pelo fluxo de autenticação do usuário.
 *
 * Responsabilidades:
 * - Realizar login no backend
 * - Persistir sessão via AuthProvider
 * - Redirecionar usuário conforme seu papel
 */
export function useLogin() {
    const navigate = useNavigate();

    const { signIn } = useAuth();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    /**
     * Executa autenticação do usuário.
     */
    async function login(data: LoginRequest) {
        try {
            setLoading(true);

            setError("");

            /**
             * Realiza login no backend.
             */
            const user = await loginRequest(data);

            /**
             * Persiste autenticação no contexto global.
             */
            signIn(
                {
                    id: user.id,
                    dispatcherId: user.dispatcher_id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                user.token
            );

            /**
             * Redireciona conforme perfil do usuário.
             */
            if (user.role === "despachante") {
                navigate(FRONTEND_ROUTES.DISPATCHER.INITIAL);

                return;
            }

            navigate(FRONTEND_ROUTES.CLIENT.SEARCH_DISPATCHER);

        } catch (err: unknown) {

            if (err instanceof Error) {
                setError(err.message);

                return;
            }

            setError("Erro inesperado ao realizar login.");

        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        loading,
        error,
    };
}
