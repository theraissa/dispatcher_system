import { FRONTEND_ROUTES } from "@/routes/frontend-routes";
import { authStorage } from "./auth-storage";

/**
 * URL base da API.
 */
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Cliente HTTP centralizado da aplicação.
 *
 * Responsabilidades:
 * - Definir URL base
 * - Adicionar token JWT automaticamente
 * - Padronizar headers
 * - Tratar erros HTTP
 * - Suportar JSON e multipart/form-data
 */
async function request<TResponse>(
    endpoint: string,
    options?: RequestInit
): Promise<TResponse> {

    /**
     * Recupera token JWT persistido.
     */
    const token = authStorage.getToken();

    /**
     * Detecta se o body é multipart/form-data.
     *
     * IMPORTANTE:
     * Quando usamos FormData:
     * - NÃO devemos definir Content-Type manualmente
     * - O navegador adiciona automaticamente:
     *   multipart/form-data + boundary
     */
    const isFormData = options?.body instanceof FormData;

    /**
     * Headers padrão da aplicação.
     */
    const headers: HeadersInit = {

        ...(token && {
            Authorization: `Bearer ${token}`,
        }),

        /**
         * JSON é o padrão da aplicação.
         *
         * Para FormData o Content-Type será removido abaixo.
         */
        "Content-Type": "application/json",

        ...options?.headers,
    };

    /**
     * Remove Content-Type quando o body é FormData.
     */
    if (isFormData) {
        delete (headers as Record<string, string>)["Content-Type"];
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    /**
     * Tenta converter resposta para JSON.
     */
    let data: unknown;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            "Servidor retornou uma resposta inválida."
        );
    }

    /**
     * Tratamento global de erros HTTP.
     */
    if (!response.ok) {

        /**
         * Sessão inválida ou expirada.
         *
         * Remove dados locais e redireciona login.
         */
        if (response.status === 401 && token) {
            authStorage.clear();

            window.location.href = FRONTEND_ROUTES.LOGIN;
        }

        const errorMessage =
            (data as { description?: string; message?: string })?.description ||
            (data as { message?: string })?.message ||
            "Erro inesperado na requisição.";

        throw new Error(errorMessage);
    }

    return data as TResponse;
}

/**
 * API Client centralizado.
 *
 * Responsável por abstrair:
 * - fetch
 * - headers
 * - autenticação
 * - serialização JSON
 * - tratamento de erros
 */
export const apiClient = {

    /**
     * Requisição GET com suporte a query params.
     */
    get: <TResponse>(
        endpoint: string,
        params?: Record<string, string | number | boolean | null | undefined>
    ) => {

        const url = new URL(`${BASE_URL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {

                if (value !== "" && value != null) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return request<TResponse>(endpoint + url.search);
    },

    /**
     * Requisição POST.
     */
    post: <TResponse, TBody = unknown>(
        endpoint: string,
        body?: TBody
    ) =>
        request<TResponse>(endpoint, {
            method: "POST",

            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body),
        }),

    /**
     * Requisição PUT.
     */
    put: <TResponse, TBody = unknown>(
        endpoint: string,
        body?: TBody
    ) =>
        request<TResponse>(endpoint, {
            method: "PUT",

            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body),
        }),

    /**
     * Requisição DELETE.
     */
    delete: <TResponse>(endpoint: string) =>
        request<TResponse>(endpoint, {
            method: "DELETE",
        }),
};
