import { clientService } from "@/services/client-service"
import type { ProfilePublicUser } from "@/types/user.types"
import { useState } from "react"


/**
 * Hook responsável por atualizar o perfil público do cliente.
 */
export function useUpdateClientProfilePublic() {

    // Controla estado de carregamento da atualização
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Realiza atualização do perfil do usuário.
     */
    async function updateProfile(
        userId: number,
        data: ProfilePublicUser
    ) {
        try {
            // Inicia loading
            setIsLoading(true)
            // Executa atualização do perfil
            return await clientService.updateClientProfilePublic(userId, data)

        } finally {
            // Finaliza loading mesmo em caso de erro
            setIsLoading(false)
        }
    }

    return {
        updateProfile,
        isLoading,
    }
}
