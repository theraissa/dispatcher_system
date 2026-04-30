import { AuthContext } from "@/types/type";
import { useContext } from "react";

/**
 * Hook base para acesso ao contexto de autenticação da aplicação.
 *
 * Responsável por:
 * - Fornecer acesso ao usuário autenticado (`user`)
 * - Fornecer o token JWT (`token`)
 * - Expor funções de autenticação (`signIn`, `signOut`)
 */
export function useAuth() {
    return useContext(AuthContext);
}
