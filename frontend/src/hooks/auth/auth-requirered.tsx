import { useAuth } from "@/hooks/auth/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook para páginas protegidas que exigem autenticação.
 *
 * Responsável por:
 * - Garantir que existe um usuário autenticado
 * - Redirecionar automaticamente para `/login` caso não exista
 * - Retornar o `user` já tipado como NÃO nulo
 *
 * Comportamento:
 * 1. Verifica se há usuário autenticado
 * 2. Se não houver:
 *    - Redireciona para `/login`
 *    - Interrompe execução (throw)
 */
export function useAuthRequired() {
    const { user, ...rest } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        throw new Error("Usuário não está autenticado!");
    }

    return { user, ...rest };
}
