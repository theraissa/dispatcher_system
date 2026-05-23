import type { ProfileDispatcher } from "@/types/dispatcher.types"
import { useEffect, useState } from "react"
import { dispatcherService } from "../../services/dispatcher-service"


/**
 * Hook responsável por gerenciar o perfil do despachante.
 *
 * Responsabilidades:
 * - Buscar dados do perfil no backend
 * - Armazenar e gerenciar estado local
 * - Atualizar campos do formulário dinamicamente
 * - Enviar atualizações para a API
 */
export function useDispatcherProfile(userId: number, dispatcherId: number) {

    const [data, setData] = useState<ProfileDispatcher>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!dispatcherId) {
            setLoading(false)
            return
        }

        // Função para buscar os dados do perfil do despachante
        async function fetchData() {
            try {
                const profile = await dispatcherService.getDispatcherProfile(dispatcherId)
                setData(profile)
            } catch (error) {
                console.error("Erro ao buscar perfil do despachante:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [dispatcherId])

    // Função genérica para atualizar campos do perfil
    function handleChange<
        T extends keyof ProfileDispatcher
    >(
        entity: T,
        field: keyof ProfileDispatcher[T],
        value: string
    ) {
        setData(prev => {
            if (!prev) return prev

            return {
                ...prev,
                [entity]: {
                    ...prev[entity],
                    [field]: value
                }
            }
        })
    }

    // Função para enviar atualizações para a API
    async function handleSubmit() {
        if (!data) return
        await dispatcherService.updateDispatcherProfile(userId, data)
    }

    return {
        data,
        setData,
        loading,
        handleChange,
        handleSubmit
    }
}
