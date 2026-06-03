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
export function useDispatcherProfile(dispatcherId: number, userId?: number) {

    const [data, setData] = useState<ProfileDispatcher>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!dispatcherId) {
            setLoading(false)
            return
        }

        async function fetchData() {
            try {
                setLoading(true) // Garante o reset do loading ao mudar de id
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

    function handleChange<T extends keyof ProfileDispatcher>(
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

    async function handleSubmit() {
        // Proteção caso seja um admin visualizando sem um userId definido
        if (!data || !userId) return
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
