import type { ProfilePublicUser, ProfileUser } from "@/types/user.types"
import { BACKEND_ROUTES } from "../routes/backend-routes"
import { apiClient } from "./api-client"


/**
 * Busca o perfil completo do usuário cliente
 */
export async function getClientProfile(userId: number) {
    const response = await apiClient.get<ProfileUser>(
        BACKEND_ROUTES.user.getById(userId)
    )
    return response
}

/**
 * Atualiza o perfil do usuário cliente
 */
export async function updateClientProfile(userId: number, data: ProfileUser) {
    const response = await apiClient.put<ProfileUser>(
        BACKEND_ROUTES.user.updateById(userId), data
    )
    return response
}

/**
 * Atualiza o perfil público do usuário cliente.
 */
export async function updateClientProfilePublic(userId: number, data: ProfilePublicUser) {
    // Cria estrutura multipart/form-data
    const formData = new FormData()

    // Adiciona dados textuais do perfil
    formData.append(
        "data",
        JSON.stringify({
            instagram: data.instagram,
            website: data.website,
        })
    )

    // Adiciona imagem do perfil, se existir
    if (data.photo instanceof File) { // Garante que é um arquivo válido antes de anexar
        formData.append("photo", data.photo)
    }

    // Recupera token JWT do usuário autenticado
    const token = localStorage.getItem("token")

    // Realiza requisição de atualização do perfil
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}${BACKEND_ROUTES.user.updateProfilePublicById(userId)}`,
        {
            method: "PUT",
            headers: {
                // Adiciona autenticação na requisição
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
            },
            // Envia dados multipart/form-data
            body: formData,
        }
    )

    // Converte resposta da API para JSON
    const responseData = await response.json()

    if (!response.ok) {
        throw new Error(
            responseData?.description ||
            responseData?.message ||
            "Erro ao atualizar perfil"
        )
    }
    return responseData
}
