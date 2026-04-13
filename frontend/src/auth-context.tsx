import { AuthContext, type UserContext } from "@/types/type";
import { useState } from "react";

/**
 * Provider responsável por gerenciar o estado global de autenticação da aplicação.
 *
 * Esse componente encapsula toda a lógica de:
 * - Armazenamento do usuário autenticado
 * - Persistência do token JWT
 * - Sincronização com o localStorage
 *
 * Ele permite que qualquer componente da aplicação acesse os dados de autenticação
 * através do hook `useAuth`, evitando acesso direto ao localStorage.
 *
 * Fluxo:
 * 1. Ao inicializar, tenta recuperar `user` e `token` do localStorage.
 * 2. Se existirem, popula o estado automaticamente (sessão persistida).
 * 3. `signIn` é usado no login para salvar os dados.
 * 4. `signOut` é usado no logout para limpar sessão.
 *
 * @param children Componentes filhos que terão acesso ao contexto de autenticação.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {

    /**
     * Estado do usuário autenticado.
     *
     * Inicialização lazy:
     * - Executa apenas na primeira renderização.
     * - Recupera dados persistidos no navegador.
     */
    const [user, setUser] = useState<UserContext | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    /**
     * Estado do token JWT.
     *
     * Utilizado para autenticação nas requisições com o backend.
     */
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    /**
     * Define os dados de autenticação após login.
     *
     * Responsável por:
     * - Atualizar o estado global (React)
     * - Persistir os dados no localStorage
     *
     * @param user Dados do usuário autenticado
     * @param token Token JWT retornado pelo backend
     */
    function signIn(user: UserContext, token: string) {
        setUser(user);
        setToken(token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }

    /**
     * Limpa os dados de autenticação (logout).
     *
     * Responsável por:
     * - Resetar o estado global
     * - Remover dados persistidos
     */
    function signOut() {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider
            value={{
                user, // Dados do usuário autenticado
                token, // Token JWT
                isAuthenticated: !!token, // Flag booleana de autenticação
                signIn, // Função de login
                signOut, // Função de logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
