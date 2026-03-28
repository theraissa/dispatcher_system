/**
 * Cliente HTTP centralizado da aplicação.
 *
 * Responsabilidades:
 * - Definir base URL
 * - Padronizar headers
 * - Tratar erros da API
 */
const BASE_URL = "http://localhost:5000/api/dispatcher-system"

async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
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

    if (!response.ok) {
        throw new Error(
            data?.description || data?.message || "Erro na requisição"
        )
    }

    return data
}

export const apiClient = {
    get: <T>(endpoint: string) =>
        request<T>(endpoint),

    post: <T>(endpoint: string, body?: any) =>
        request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body?: any) =>
        request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, {
            method: "DELETE"
        })
}
