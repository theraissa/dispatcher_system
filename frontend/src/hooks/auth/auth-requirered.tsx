import { useAuth } from "@/hooks/auth/use-auth";
import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import type { UserContext } from "@/types/type";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook responsável por proteger páginas privadas da aplicação.
 *
 * Objetivo:
 * - Garantir que apenas usuários autenticados acessem determinadas telas.
 * - Redirecionar automaticamente usuários não autenticados.
 *
 * Funcionamento:
 * 1. Recupera o estado global de autenticação através do `useAuth`.
 * 2. Verifica se o usuário possui um token válido (`isAuthenticated`).
 * 3. Caso NÃO esteja autenticado:
 *    - Redireciona automaticamente para a tela de login.
 *
 * Esse hook é normalmente utilizado dentro de páginas privadas:
 *
 * Exemplo:
 * ```tsx
 * const { user } = useAuthRequired();
 * ```
 */
export function useAuthRequired() {

    // Recupera informações globais de autenticação.
    const auth = useAuth();

    // Hook do React Router utilizado para navegação programática.
    const navigate = useNavigate();

    /**
     * Effect executado sempre que o estado de autenticação mudar.
     *
     * Caso o usuário não esteja autenticado,
     * ele será redirecionado para a tela de login.
     */
    useEffect(() => {
        if (!auth.isAuthenticated || !auth.user) {
            navigate(FRONTEND_ROUTES.LOGIN, {
                replace: true,
            });
        }
    }, [auth, navigate]);

    /**
     * A partir daqui garantimos ao TypeScript
     * que o usuário existe.
     */
    if (!auth.user) {
        throw new Error("Usuário não autenticado.");
    }

    return {
        ...auth,

        /**
         * Sobrescreve o tipo:
         * user agora NÃO pode ser null.
         */
        user: auth.user as UserContext,
    };
}
