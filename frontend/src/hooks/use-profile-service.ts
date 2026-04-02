import { useEffect, useState } from "react"
import {
    getDispatcherServices,
    getAllServices,
    removeDispatcherService,
    addDispatcherService,
    updateDispatcherService
} from "../services/profile-service"


/*
 * Tipagem para os serviços
 */
type Service = {
    id: number
    name: string
    price?: number
}

/**
 * Hook personalizado para gerenciar os serviços do perfil do despachante.
 */
export function useProfileServices(userId: number) {
    const [services, setServices] = useState<Service[]>([])
    const [allServices, setAllServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    // Busca os serviços do despachante e a lista completa de serviços disponíveis
    async function fetchData() {
        const [userServices, globalServices] = await Promise.all([
            getDispatcherServices(userId),
            getAllServices()
        ])

        setServices(userServices)
        setAllServices(globalServices)
    }

    // useEffect para carregar os dados quando o componente for montado ou quando o userId mudar
    useEffect(() => {
        if (!userId) return

        fetchData().finally(() => setLoading(false))
    }, [userId])

    // Função para remover um serviço do perfil do despachante
    async function removeService(serviceId: number) {
        await removeDispatcherService(userId, serviceId)

        setServices(prev => prev.filter(s => s.id !== serviceId))
    }

    // Função para adicionar novos serviços ao perfil do despachante
    async function addServices(newServices: Service[]) {
        await Promise.all(
            newServices.map(service =>
                addDispatcherService(userId, service.id)
            )
        )

        setServices(prev => [...prev, ...newServices])
    }

    // Função para atualizar o preço de um serviço do despachante
    async function updateService(serviceId: number, price: number) {
        await updateDispatcherService(userId, serviceId, price)

        setServices(prev =>
            prev.map(s =>
                s.id === serviceId ? { ...s, price } : s
            )
        )
    }

    return {
        services,
        allServices,
        loading,
        removeService,
        addServices,
        updateService
    }
}
