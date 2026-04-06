import { FRONTEND_ROUTES } from "@/routes/frontend-routes"

/**
 * Cliente HTTP centralizado da aplicação.
 *
 * Responsabilidades:
 * - Definir base URL
 * - Padronizar headers
 * - Tratar erros da API
 */

const BASE_URL = "http://localhost:5000/api/dispatcher-system"

/**
 * Função genérica para realizar requisições HTTP.
 */
async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {

    // Inclui token de autenticação, se disponível
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers
        },
        ...options
    })


    //Resposta precisa ser em JSON
    let data
    try {
        data = await response.json()
    } catch {
        throw new Error("Resposta inválida do servidor (não é JSON)")
    }

    // Tratamento de erros
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = FRONTEND_ROUTES.LOGIN
        }

        throw new Error(
            data?.description || data?.message || "Erro na requisição"
        )
    }

    return data
}

/**
 * API Client com métodos para cada verbo HTTP.
 *
 * Exemplo de uso:
 * apiClient.get("/users", { search: "John" })
 * apiClient.post("/login", { email, password })
 */
export const apiClient = {

    // Método GET com suporte a query params
    get: <T>(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>) => {
        const query = params
            ? "?" +
            new URLSearchParams(
                Object.entries(params)
                    .filter(([_, v]) => v !== "" && v != null)
                    .map(([k, v]) => [k, String(v)])
            ).toString()
            : ""

        return request<T>(endpoint + query);
    },

    post: <T>(endpoint: string, body?: undefined) =>
        request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body?: undefined) =>
        request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, {
            method: "DELETE"
        })
}
