/**
 * Hook responsável por gerenciar o perfil do usuário.
 */
import { useEffect, useState } from "react"
import type { ProfileClient } from "../types/type"
import { getClientProfile, updateClientProfile } from "@/services/client-service"

export function useClientProfile(userId: string) {
    const [data, setData] = useState<ProfileClient | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log("USER ID:", userId)
        if (!userId) {
            setLoading(false)
            return
        }

        // Função para buscar os dados do perfil do cliente
        async function fetchData() {
            console.log("Buscando perfil...")

            try {
                const profile = await getClientProfile(userId)
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
        T extends keyof ProfileClient
    >(
        entity: T,
        field: keyof ProfileClient[T],
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

        await updateClientProfile(userId, data)
    }

    return {
        data,
        setData,
        loading,
        handleChange,
        handleSubmit,
    }
}
