import type { ProfilePublicUser, ProfileUser } from "@/types/user.types";
import { BACKEND_ROUTES } from "../routes/backend-routes";
import { apiClient } from "./api-client";


export const clientService = {

    /**
     * Busca o perfil completo do usuário cliente.
     */
    getClientProfile(userId: number) {
        return apiClient.get<ProfileUser>(
            BACKEND_ROUTES.user.getById(userId)
        );
    },

    /**
     * Atualiza o perfil do usuário cliente.
     */
    updateClientProfile(userId: number, data: ProfileUser) {
        return apiClient.put<ProfileUser>(
            BACKEND_ROUTES.user.updateById(userId),
            data
        );
    },

    /**
     * Atualiza informações públicas do perfil.
     *
     * Essa rota utiliza multipart/form-data
     * para permitir upload de imagem.
     */
    updateClientProfilePublic(
        userId: number,
        data: ProfilePublicUser
    ) {

        /**
         * Estrutura multipart/form-data.
         */
        const formData = new FormData();

        /**
         * Dados textuais do perfil.
         */
        formData.append(
            "data",
            JSON.stringify({
                instagram: data.instagram,
                website: data.website,
            })
        );

        /**
         * Adiciona foto apenas se existir.
         */
        if (data.photo instanceof File) {
            formData.append("photo", data.photo);
        }

        /**
         * O apiClient detecta automaticamente:
         * - FormData
         * - Authorization
         * - Content-Type
         * - Tratamento de erro
         */
        return apiClient.put(
            BACKEND_ROUTES.user.updateProfilePublicById(userId),
            formData
        );
    },
};
