import { clientService } from "@/services/client-service"
import type { ProfileUser } from "@/types/user.types"
import { useEffect, useState } from "react"


/**
 * Hook responsável por gerenciar o perfil do usuário.
 */
export function useClientProfile(userId: number) {
    const [data, setData] = useState<ProfileUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) {
            setLoading(false)
            return
        }

        // Função para buscar os dados do perfil do cliente
        async function fetchData() {
            console.log("Buscando perfil...")

            try {
                const profile = await clientService.getClientProfile(userId)
                setData(profile)
            } catch (error) {
                console.error("ERRO AO BUSCAR PERFIL DO CLIENTE:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userId])

    // Função genérica para atualizar campos do perfil
    function handleChange<
        T extends keyof ProfileUser
    >(
        entity: T,
        field: keyof ProfileUser[T],
        value: any
    ) {
        setData(prev => {
            if (!prev) return prev

            return {
                ...prev,
                [entity]: {
                    ...(prev[entity] ?? {}),
                    [field]: value
                }
            }
        })
    }

    // Função para enviar atualizações para a API
    async function handleSubmit() {
        if (!data) return

        console.log("ANTES DE ENVIAR:", data)
        await clientService.updateClientProfile(userId, data)
    }

    return {
        data,
        setData,
        loading,
        handleChange,
        handleSubmit,
    }
}
