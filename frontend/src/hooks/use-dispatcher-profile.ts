/**
 * Hook responsável por gerenciar o perfil do despachante.
 *
 * Responsabilidades:
 * - Buscar dados do perfil no backend
 * - Armazenar e gerenciar estado local
 * - Atualizar campos do formulário dinamicamente
 * - Enviar atualizações para a API
 *
 * @param userId ID do usuário/despachante
 *
 * @returns
 * - data: dados do perfil
 * - loading: estado de carregamento inicial
 * - handleChange: função para atualizar campos
 * - handleSubmit: função para salvar alterações
 */
import { useEffect, useState } from "react"
import { getDispatcherProfile, updateDispatcherProfile } from "../services/dispatcher-service"
import type { ProfileDispatcher } from "@/types/dispatcher.types"

export function useDispatcherProfile(userId: string) {
    const [data, setData] = useState<ProfileDispatcher | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (!userId) {
            setLoading(false)
            return
        }

        // Função para buscar os dados do perfil do despachante
        async function fetchData() {
            try {
                const profile = await getDispatcherProfile(userId)
                setData(profile)
            } catch (error) {
                console.error("ERRO AO BUSCAR PERFIL:", error)
            } finally {
                console.log("FINALIZOU FETCH")
                setLoading(false)
            }
        }

        fetchData()
    }, [userId])

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
        await updateDispatcherProfile(userId, data)
    }

    return {
        data,
        setData,
        loading,
        handleChange,
        handleSubmit
    }
}
