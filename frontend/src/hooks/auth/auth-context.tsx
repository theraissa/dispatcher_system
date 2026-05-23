import { AuthContext, type UserContext } from "@/types/type";
import { useMemo, useState } from "react";

/**
 * Provider global responsável por gerenciar autenticação da aplicação.
 *
 * Esse componente encapsula toda lógica relacionada à sessão do usuário,
 * funcionando como uma "fonte global de verdade" da autenticação.
 *
 * Responsabilidades:
 * - Armazenar usuário autenticado
 * - Armazenar token JWT
 * - Persistir sessão no localStorage
 * - Restaurar sessão após refresh da página
 * - Expor funções de login/logout
 * - Compartilhar estado global via Context API
 *
 * Fluxo de funcionamento:
 *
 * 1. Quando a aplicação inicia:
 *    - O provider tenta recuperar dados salvos no localStorage.
 *    - Caso existam:
 *      → restaura automaticamente a sessão do usuário.
 *
 * 2. Durante o login:
 *    - `signIn()` salva usuário + token no estado React.
 *    - Também persiste os dados no localStorage.
 *
 * 3. Durante o logout:
 *    - `signOut()` remove dados do estado.
 *    - Remove também os dados persistidos.
 *
 * 4. Qualquer componente da aplicação pode acessar:
 *    - usuário autenticado
 *    - token JWT
 *    - funções de login/logout
 *
 * através do hook:
 *
 * ```tsx
 * const auth = useAuth();
 * ```
 */
export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    /**
     * Estado global do usuário autenticado.
     *
     * Lazy Initialization:
     * - Essa função executa apenas na primeira renderização.
     * - Evita acessar localStorage em todos renders.
     *
     * Objetivo:
     * - Restaurar sessão automaticamente após refresh da página.
     */
    const [user, setUser] = useState<UserContext | null>(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser ? JSON.parse(storedUser) : null;
    });

    /**
     * Estado global do token JWT.
     *
     * Responsável por:
     * - autenticação nas requisições
     * - controle de sessão
     * - proteção de rotas
     */
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });

    /**
     * Realiza login no frontend.
     *
     * Responsabilidades:
     * - Atualizar estado React
     * - Persistir sessão no navegador
     *
     * @param user Dados do usuário autenticado
     * @param token JWT retornado pelo backend
     */
    function signIn(user: UserContext, token: string) {
        /**
         * Atualiza estado global React.
         *
         * Isso faz a aplicação inteira saber
         * que o usuário está autenticado.
         */
        setUser(user);
        setToken(token);

        /**
         * Persiste sessão no navegador.
         *
         * Sem isso:
         * - usuário perderia login ao atualizar página.
         */
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }

    /**
     * Realiza logout da aplicação.
     *
     * Responsabilidades:
     * - Limpar estado React
     * - Remover persistência local
     */
    function signOut() {
        // Limpa estado global da aplicação.
        setUser(null);
        setToken(null);

        // Remove dados persistidos do navegador.
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    /**
     * Objeto compartilhado globalmente pelo Context API.
     *
     * useMemo evita recriação desnecessária do objeto
     * a cada renderização do Provider.
     *
     * Sem useMemo:
     * - todos componentes consumidores rerenderizariam sempre.
     *
     * Com useMemo:
     * - valor só muda quando user/token mudarem.
     */
    const value = useMemo(
        () => ({
            // Usuário autenticado.
            user,
            // Token JWT atual.
            token,
            // Flag booleana indicando autenticação.
            isAuthenticated: !!token,
            // Função responsável pelo login.
            signIn,
            // Função responsável pelo logout.
            signOut,
        }),
        [user, token]
    );

    /**
     * Disponibiliza o contexto global de autenticação
     * para toda aplicação React.
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
